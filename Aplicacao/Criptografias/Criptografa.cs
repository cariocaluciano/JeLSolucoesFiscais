namespace JeLSolucoesFiscais.Aplicacao.Criptografias;

public class Criptografa
{

    public string RetornaValorCriptografado(string valor) 
    {
        byte[] bytesValor = System.Text.Encoding.UTF8.GetBytes(valor);
        string base64Valor = Convert.ToBase64String(bytesValor);

        byte[] bytesValorForte = System.Text.Encoding.UTF8.GetBytes(base64Valor);
        string base64ValorCriptografado = Convert.ToBase64String(bytesValorForte);

        return base64ValorCriptografado;
    }

}
