using JeLSolucoesFiscais.Aplicacao.Criptografias;

namespace JeLSolucoesFiscais.Aplicacao.Usuario;

public class UsuariosCadastrados
{
    public List<Usuario> Usuarios()
    {
        Criptografa criptografa = new Criptografa();
        List<Usuario> usuarios = new List<Usuario>
        {
            new Usuario { Email = criptografa.RetornaValorCriptografado("Luciano"), Senha = criptografa.RetornaValorCriptografado("123456789"), FimAcesso = new DateTime(2026,10,2) },
            new Usuario { Email =criptografa.RetornaValorCriptografado("Jhon"), Senha = criptografa.RetornaValorCriptografado("123456789"), FimAcesso = new DateTime(2026,10,22) },
            new Usuario { Email =criptografa.RetornaValorCriptografado("Adm"), Senha = criptografa.RetornaValorCriptografado("123456789"), FimAcesso =  new DateTime(2026,11,03) },
            new Usuario { Email =criptografa.RetornaValorCriptografado("Usuario"), Senha = criptografa.RetornaValorCriptografado("123456789"), FimAcesso =  new DateTime(2026,11,03) },

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

    public bool IsInadimplente(string Email, string Senha)
    {
        Criptografa criptografa = new Criptografa();
        string emailCriptografado = criptografa.RetornaValorCriptografado(Email);
        string senhaCriptografada = criptografa.RetornaValorCriptografado(Senha);

        var usuario = Usuarios().Find(u => u.Email == emailCriptografado && u.Senha == senhaCriptografada);

        if (usuario != null)
        {
            DateTime fimAcesso = usuario.FimAcesso;

            Console.WriteLine($"Data de fim de acesso: {fimAcesso}");
            return fimAcesso < DateTime.Now;
          
        }
        else
        {
            return true;
        }


    }

}
