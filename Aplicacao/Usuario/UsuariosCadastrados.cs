using JeLSolucoesFiscais.Aplicacao.Criptografias;

namespace JeLSolucoesFiscais.Aplicacao.Usuario;

public class UsuariosCadastrados
{
    public List<Usuario> Usuarios()
    {
        Criptografa criptografa = new Criptografa();
        List<Usuario> usuarios = new List<Usuario>
        {
            new Usuario { Email = criptografa.RetornaValorCriptografado("Luciano"), Senha = criptografa.RetornaValorCriptografado("123456789"), FimAcesso = DateTime.Now.AddMonths(1) },
            new Usuario { Email =criptografa.RetornaValorCriptografado("Jhon"), Senha = criptografa.RetornaValorCriptografado("123456789"), FimAcesso = DateTime.Now.AddMonths(1) }
        };

        return usuarios;
    }

    public bool VerificaCadastrousuario(string Email, string Senha) 
    {
        Criptografa criptografa = new Criptografa();

        string emailCriptografado = criptografa.RetornaValorCriptografado(Email);
        string senhaCriptografada = criptografa.RetornaValorCriptografado(Senha);

        var usuario = Usuarios().FirstOrDefault(u => u.Email == emailCriptografado && u.Senha == senhaCriptografada);

        bool usuarioExiste = Usuarios().Any(u => u.Email == emailCriptografado && u.Senha == senhaCriptografada);

        if (usuarioExiste)
        {
            return true;
        }
        else
        {
            return false;
        }

    }

}
