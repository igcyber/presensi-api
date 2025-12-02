import app from '@adonisjs/core/services/app';
import type { HttpContext } from '@adonisjs/core/http';

type Constructor<T = any> = new (...args: any[]) => T;

export function wrapRoute(controllers: Constructor[]) {
    const wrappedControllers: Record<string, any> = {};

    controllers.forEach((ControllerClass) => {
        const proxy = new Proxy({}, {
            get(_target, prop: string) {

                return async (ctx: HttpContext) => {
                    try {
                        if (ControllerClass.length === 0) {
                            return ctx.response.badRequest({ 
                                message: `Akses Ditolak: Controller ${ControllerClass.name} tidak memiliki konstruktor.`,
                                solution: `Harap tambahkan 'constructor(protected sampleServices: SampleServices) {}' dan pastikan '@inject()' ada.`
                            });
                        }

                        const controllerInstance = await app.container.make(ControllerClass);

                        if (typeof (controllerInstance as any)[prop] === 'function') {
                            return (controllerInstance as any)[prop](ctx);
                        } else {
                            return ctx.response.notFound({ message: `Method '${String(prop)}' Tidak Ditemukan Pada Controller ${ControllerClass.name}.` });
                        }

                    } catch (error) {

                        console.error(`Error DI atau Eksekusi Controller: ${error.message}`);

                        return ctx.response.internalServerError({ 
                            message: `Gagal menjalankan controller ${ControllerClass.name}. Pastikan @inject() sudah benar.`,
                            error: error.message
                        });
                    }
                };
            }
        });

        wrappedControllers[ControllerClass.name] = proxy;
    });

    return wrappedControllers;
}
