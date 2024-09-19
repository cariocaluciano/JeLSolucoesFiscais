using System.Text;

namespace JeLSolucoesFiscais.Aplicacao.Criptografias;

public class Descriptografa
{
    public string RetornaValorDescriptografado(string valor)
    {
        string Valorbase64 = valor; 
        byte[] data = Convert.FromBase64String(Valorbase64);
        string DescodificaValor = Encoding.UTF8.GetString(data);

        string Valorbase64Desc = DescodificaValor;
        byte[] dataDesc = Convert.FromBase64String(Valorbase64Desc);
        string DescodificaValorDesc = Encoding.UTF8.GetString(dataDesc);



        return DescodificaValorDesc;
    }

}
