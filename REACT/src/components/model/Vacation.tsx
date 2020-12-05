export class Vacation{
    public constructor(
        public id:number = 0,
        public description:string = '', 
        public destination:string = '',
        public image:any = 'https://www.nikolpoulin.com/asset/image/product/s_3.png',
        public starting:string = '',
        public ending:string = '',
        public price:number = 0,
        public isFavorite: boolean = false,
        public amountOfFollowers: number = 0,
    ){}
}