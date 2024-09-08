using Microsoft.JSInterop;

namespace JeLSolucoesFiscais.Aplicacao.Usuario;

public class LocalStorageService
{
    private readonly IJSRuntime _jsRuntime;

    public LocalStorageService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public void  SetItemAsync(string key, string value)
    {
         _jsRuntime.InvokeVoidAsync("localStorage.setItem", key, value);
    }

    public async Task<string> GetItemAsync(string key)
    {
        return await _jsRuntime.InvokeAsync<string>("localStorage.getItem", key);
    }

    public async Task RemoveItemAsync(string key)
    {
        await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", key);
    }
}
