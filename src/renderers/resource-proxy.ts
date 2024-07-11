export class ResourceProxy {
  constructor(
    public mimeType: string,
    private resourceIdentifier: string,
    private getContent: (id: string) => Promise<string> | Promise<Buffer>
  ) { }
  private _content: Promise<string> | Promise<Buffer> | undefined;
  public async contentAsync(): Promise<string | Buffer> {
    return this._content ??= this.getContent(this.resourceIdentifier);
  }
}
