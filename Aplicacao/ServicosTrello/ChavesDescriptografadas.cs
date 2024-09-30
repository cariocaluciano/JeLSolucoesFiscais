using JeLSolucoesFiscais.Aplicacao.Criptografias;

namespace JeLSolucoesFiscais.Aplicacao.ServicosTrello;

public class ChavesDescriptografadas
{
    public Descriptografa Descriptografa = new Descriptografa();
    public ChavesAPITrello ChaveApi = new ChavesAPITrello();

    public string ApiKeyDescriptografada()
    {
        return Descriptografa.RetornaValorDescriptografado(ChaveApi.API_KEY);
    }
    public string TokenDescriptografado()
    {
        return Descriptografa.RetornaValorDescriptografado(ChaveApi.TOKEN);
    }
    public string ListIdCadClientesDescriptografada()
    {
        return Descriptografa.RetornaValorDescriptografado(ChaveApi.ListIdCadClientes);
    }
}
