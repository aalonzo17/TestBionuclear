using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Back_End.Entidades
{
    /*Esta es la entidad que representa los clientes*/
    public class Clientes
    {
        [Key]
        public int id { get; set; }
        [Required(ErrorMessage = "El campo nombres es obligatorio")]
        public string Nombres { get; set; }
        public string Genero { get; set; }
        [Required(ErrorMessage = "El campo fecha de nacimiento es obligatorio")]
        public DateTime FechaNacimiento { get; set; }
        [StringLength(100,ErrorMessage ="La longitud de la direccion debe ser menor a 100 caracteres")]
        [Required(ErrorMessage ="El campo direccion es obligatorio")]
        public string Direccion { get; set; }
    }
}
