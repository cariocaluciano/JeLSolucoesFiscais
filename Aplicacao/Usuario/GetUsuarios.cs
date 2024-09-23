
namespace JeLSolucoesFiscais.Aplicacao.Usuario;

public class GetUsuarios
{

    public async Task/*<List<Usuario>>*/ RecuperaUsuarios()
    {
        var client = new HttpClient();
        // var request = new HttpRequestMessage(HttpMethod.Get, "https://api.trello.com/1/lists/66ec67b2dc7d3da6b8ed212c/cards?key=aed7fff11b2469ae9a9b4b2ba34b2bf6&token=ATTAe0bae124cdc4da264f1989fec59ef01df8bab5ffe36fb40cce51c040a20137611A32FFA0");
        var request = new HttpRequestMessage(HttpMethod.Get, "https://api.trello.com/1/cards/66f1be10ca24192e9947a494?key=aed7fff11b2469ae9a9b4b2ba34b2bf6&token=ATTAe0bae124cdc4da264f1989fec59ef01df8bab5ffe36fb40cce51c040a20137611A32FFA0");
        request.Headers.Add("Cookie", "dsc=007b999d1b6cb84d97ff48c83c95bd58898681421bb88ca333fcd97b771f6282");
        var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadAsStringAsync();

        List<(string Usuario, string Senha)> usuariosSenhas = new List<(string Usuario, string Senha)>();

        Console.WriteLine(result);
        //66f1be10ca24192e9947a494
    }


}
