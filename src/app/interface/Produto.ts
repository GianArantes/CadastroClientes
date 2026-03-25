import { Categoria } from "./Categoria";
import { Ncm } from "./Ncm";
import { ProdutoLitragem } from "./ProdutoLitragem";

export interface Produto {
  id: string;
  nome: string;
  refNf: string;
  ipi: number;
  peso: number;
  qtdPorEmbalagem: number;


  litragem: ProdutoLitragem;
  categoria: Categoria;
  ncm: Ncm;
}
