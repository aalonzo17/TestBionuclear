using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back_End.DTOS
{
    /*Este DTO se creo para la validacion de la informacion de usuarios*/
    public class UsuarioDTO
    {
        public string Id { get; set; }
        public string Email { get; set; }
    }
}
