import * as faceapi from 'face-api.js'
import { Canvas, Image, ImageData, loadImage } from 'canvas'
import * as fs from 'fs'

faceapi.env.monkeyPatch({ 
    Canvas: Canvas as any,
    Image: Image as any,
    ImageData: ImageData as any
});

export class FaceApiHelpers {
    private static modelsLoaded = false;

    static async loadModels() {
        if (this.modelsLoaded) return

        const modelPath         =   './storage/models'

        try {
            if (!fs.existsSync(modelPath)) throw {
                code: 404,
                message: `Model directory not found: ${modelPath}`
            }

            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
                faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
                faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
            ]);
            
            this.modelsLoaded = true;
        } catch (error) {
            throw {
                code: 500,
                message: `Model directory not found: ${modelPath}`
            }
        }
    }

    /**
     * Detect face dan return descriptor
     */
    static async detectFace(imagePath: string): Promise<Float32Array | null> {
        await this.loadModels()

        const img       = await loadImage(imagePath)
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

        if (!detection) return null

        return detection.descriptor
    }

    /**
     * Convert descriptor dari DB (object {0:..} atau array) menjadi Float32Array(128)
     */
    static normalizeDescriptor(descriptor: any): Float32Array {
        if (descriptor instanceof Float32Array) return descriptor

        // Jika descriptor berbentuk array normal
        if (Array.isArray(descriptor)) return new Float32Array(descriptor)

        // Jika descriptor berbentuk object {0:...,1:...}
        const values: number[] = []

        Object.keys(descriptor)
            .sort((a, b) => Number(a) - Number(b)) // urutkan index
            .forEach((key) => {
                values.push(descriptor[key])
            })

        return new Float32Array(values)
    }

    /**
     * Compare descriptor wajah (pegawai vs foto baru)
     */
    static compareDescriptors(
        savedDescriptor: Float32Array | number[],
        newDescriptor: Float32Array,
        threshold: number = 0.5
    ): { matched: boolean; distance: number } {
        const descA = this.normalizeDescriptor(savedDescriptor)
        const descB = this.normalizeDescriptor(newDescriptor)

        if (descA.length !== descB.length) {
            throw {
                code: 500,
                message: `Descriptor length mismatch: saved=${descA.length} new=${descB.length}`
            }
        }

        const distance = faceapi.euclideanDistance(descA, descB)

        return {
            matched: distance <= threshold,
            distance,
        }
    }

    /**
     * Compare langsung dari foto pegawai vs foto baru
     * (foto pegawai di server, foto absen yang baru dikirim)
     */
    static async compareImages(
        savedImagePath: string,
        newImagePath: string,
        threshold: number = 0.5
    ) {
        const savedDescriptor   = await this.detectFace(savedImagePath);
        const newDescriptor     = await this.detectFace(newImagePath);

        if (!savedDescriptor) {
            throw {
                code: 422,
                message: 'Wajah tidak terdeteksi pada foto pegawai'
            };
        }

        if (!newDescriptor) {
            throw {
                code: 422,
                message: 'Wajah tidak terdeteksi pada foto yang dikirim'
            };
        }

        return this.compareDescriptors(savedDescriptor, newDescriptor, threshold);
    }

    /**
     * Mencocokkan foto absen dengan descriptor pegawai yang tersimpan di database
     */
    static async matchSavedDescriptor(
        descriptorInDB: number[],
        newImagePath: string,
        threshold: number = 0.5
    ) {
        const newDescriptor = await this.detectFace(newImagePath);

        if (!newDescriptor) {
            throw {
                code: 422,
                message: 'Wajah tidak terdeteksi pada foto absensi'
            };
        }

        return this.compareDescriptors(descriptorInDB, newDescriptor, threshold);
    }
}
