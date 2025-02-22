using System.ComponentModel.DataAnnotations;

namespace JeLSolucoesFiscais.Aplicacao.Usuario;


public class Cliente
{
  public string Id { get; set; }
  [Required]
  public string Nome { get; set; }
  [Required]
  public string Email { get; set; }
  [Required]
  public string DataVencimento { get; set; }
  [Required]
  public string Contato { get; set; }
  [Required]
  public string Valor { get; set; }
  [Required]
  public string IsAdm { get; set; }
  [Required]
  public string ModulosLiberado { get; set; }
  [Required]
  public string Senha { get; set; }
}
