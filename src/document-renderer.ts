export class DocumentRenderer {
    constructor(
        public getBodyHtml:Function,
        public getCssUriArray?:Function,
        public getTitle?:Function,
        public getResource?: Function
    ) { }
}