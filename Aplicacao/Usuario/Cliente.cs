using System.ComponentModel.DataAnnotations;

namespace JeLSolucoesFiscais.Aplicacao.Usuario;


public class Cliente
{
    [Required]
    public string Nome { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string DataPagamento { get; set; }
    [Required]
    public string Contato { get; set; }
}
