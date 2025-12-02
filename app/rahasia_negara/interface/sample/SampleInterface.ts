import BaseInterface from '#IInterfaces/core/BaseInterface'
import Sample from '#models/sample/sample'

export default interface SampleInterface extends BaseInterface<Sample> {
	findAll(): Promise<Sample[]>
}