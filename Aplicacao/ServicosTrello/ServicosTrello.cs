using JeLSolucoesFiscais.Aplicacao.Criptografias;
using JeLSolucoesFiscais.Aplicacao.Usuario;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace JeLSolucoesFiscais.Aplicacao.ServicosTrello;


public class ServicosTrello
{
    public  ChavesDescriptografadas ChavesAPITrello = new ChavesDescriptografadas();
    public async Task<JArray> ObterClientesAsync()
    {
        using (HttpClient client = new HttpClient())
        {
            try
            {
                var API_KEY = ChavesAPITrello.ApiKeyDescriptografada();
                var TOKEN = ChavesAPITrello.TokenDescriptografado();
                var LIST_ID = ChavesAPITrello.ListIdCadClientesDescriptografada();

                string url = $"https://api.trello.com/1/lists/{LIST_ID}/cards?key={API_KEY}&token={TOKEN}";

                //client.DefaultRequestHeaders.Add("Authorization", $"Bearer {TOKEN}");
                //client.DefaultRequestHeaders.Add("API-Key", API_KEY);

                HttpResponseMessage response = await client.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    JArray cards = JArray.Parse(jsonResponse);
                    return cards;
                }
                else
                {
                    Console.WriteLine($"Erro na requisição: {response.StatusCode}");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro: {ex.Message}");
                return null;
            }
        }
    }

    public async Task<dynamic> CadastrarClienteAsync(Cliente cliente)
    {
        using (HttpClient client = new HttpClient())
        {
            try
            {
                var API_KEY = ChavesAPITrello.ApiKeyDescriptografada();
                var TOKEN = ChavesAPITrello.TokenDescriptografado();
                var LIST_ID = ChavesAPITrello.ListIdCadClientesDescriptografada();

                string url = $"https://api.trello.com/1/cards?key={API_KEY}&token={TOKEN}&idList={LIST_ID}";


                //client.DefaultRequestHeaders.Add("Authorization", $"Bearer {TOKEN}");
                //client.DefaultRequestHeaders.Add("API-Key", API_KEY);

                var jsonContent = JsonConvert.SerializeObject(new
                {
                    name = cliente.Nome,
                    desc = JsonConvert.SerializeObject(cliente)
                });

                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<dynamic>(jsonResponse); // Retorna o objeto JSON
                }
                else
                {
                    Console.WriteLine($"Erro na requisição: {response.StatusCode}");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERRO");
                Console.WriteLine($"Erro: {ex.Message}");
                return null;
            }
        }
    }

}
