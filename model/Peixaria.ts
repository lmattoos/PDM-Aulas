export class Peixaria {
  public uid: string;
  public nome: string;
  public urlFoto: string;
  public cnpj: string;
  public cpf: string;
  public email: string;
  public telefone: string;
  public descricao: string;
  constructor(
    uid: string,
    nome: string,
    urlFoto: string,
    cnpj: string,
    cpf: string,
    email: string,
    telefone: string,
    descricao: string,
  ) {
    this.uid = uid;
    this.email = email;
    this.nome = nome;
    this.urlFoto = urlFoto;
    this.telefone = telefone;
    this.cpf = cpf;
    this.cnpj = cnpj;
    this.descricao = descricao;
  }
}
