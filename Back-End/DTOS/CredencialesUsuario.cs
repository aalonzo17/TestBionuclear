using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Back_End.DTOS
{
    /*DTOS PARA LA VALIDACION DE CREDENCIALES DE USUARIOS DONDE TIENE COMO PROPIEDADES EL EMAIL Y EL PASSWORD*/
    public class CredencialesUsuario
    {
        [EmailAddress]
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
