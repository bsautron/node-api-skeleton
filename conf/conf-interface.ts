export interface IMongoConf {
	uri
}
export default interface IConf {
	name: string,
	port: number,
	mongo: IMongoConf
}