using AspNetCore.Reporting;
using AspNetCore.Reporting.ReportExecutionService;
using Back_End.DTOS;
using Back_End.Entidades;
using Back_End.Utilidades;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Back_End.Controllers
{
    //ESTA EL EL API DEFINIDA PARA LA ENTIDAD DE CLIENTES
    [Route("api/clientes")]
    [ApiController]
    //SOLO SE PERMITE EL ACCESO A USUARIO AUTORIZADOS CON SU RESPECTIVO WEB TOKEN
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ClientesController : Controller
    {
        // VARIABLES DE AMBIENTE
        private readonly AplicationDbContext _aplicationDbContext;
        private readonly IWebHostEnvironment _webHostEnvironment;
        //CONTRUCTOR CON VARIABLES DE AMBIENTE
        public ClientesController(AplicationDbContext aplicationDbContext, IWebHostEnvironment webHostEnvironment)
        {
            _aplicationDbContext = aplicationDbContext;
            _webHostEnvironment = webHostEnvironment;
            //SE INICIALIZA UN REGISTRES PROVIDER PARA LA GENERACION DEL RESPORTE DE ESTADO DE CUENTA
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        }

        // METODO DEL API TIPO GET QUE RETORNA UN CLIENTE FILTRADO POR SI ID
        [HttpGet("{Id:int}")]
        public async Task<ActionResult<Clientes>> Get(int Id)
        {
            var cliente = await _aplicationDbContext.clientes.FirstOrDefaultAsync(x => x.id == Id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        //METODO DEL API TIPO GET DONDE SE GENERA EL REPORTE DE ESTADO DE CUENTA QUE DEVUELVE UN FILE TIPO PDF 
        [HttpGet("reporte/{Id:int}")]
        public ActionResult reporte(int Id)
        {
            string mimetype = "";
            int extension = 1;
            //RUTA DEL REPORTE
            var path = $"{this._webHostEnvironment.WebRootPath}\\report\\EstadoCuenta.rdlc";
            //FILTRO DE REGISTROS POR ID DEL CLIENTE QUE SE RECIBE COMO PARAMETRO
            var data = _aplicationDbContext.OrdenesVentas.Where(x => x.idCliente == Id).ToList();
            //DICCIONARIO DE PARAMETROS PARA EL REPORTE
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            // SE INICIALIZA EL REPORTE CON LA RUTA DEFINIDA MAS ARRIBA
            LocalReport localReport = new LocalReport(path);
            //SE AGREGA EL DATASET CORRESPONDIENTE AL REPORTE Y SE AGREGA LA DATA FILTRADA
            localReport.AddDataSource("DataSet1", data);
            //SE AGREGAN LOS PARAMETROS AL REPORTE SI SE USAN
            if (parameters != null && parameters.Count > 0)
            {
                List<ReportParameter> reportparameter = new List<ReportParameter>();
                foreach (var record in parameters)
                {
                    reportparameter.Add(new ReportParameter());
                }

            }
            //SE EJECUTA EL REPORTE
            var result = localReport.Execute(RenderType.Pdf, extension, parameters, mimetype);
            //SE DEVUELVE UN FILE CON EL MAINSTREAM DEL REPORTE Y UN APPLICATION/JSON
            return File(result.MainStream,"application/pdf");
        }

        //METODO DEL API DE TIPO GET QUE RETORNA UN LISTADO DE TODO LOS CLIENTES CON UN LIMITE DE 25000
        [HttpGet] 
        public async Task<ActionResult<List<Clientes>>> Get([FromQuery] PaginacionDTO paginacionDTO)
        {
            var queryable = _aplicationDbContext.clientes.Take(25000).AsQueryable();
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            return await queryable.Paginar(paginacionDTO).ToListAsync();           
        }
        //METODO DEL API DE TIPO GET QUE REALIZA UNA BUSQUEDA POR EL NOMBRE DEL CLIENTE
        [HttpGet("filtro")]
        public async Task<ActionResult<List<Clientes>>> filtro([FromQuery] PaginacionDTO paginacionDTO, string search)
        {
            var queryable = _aplicationDbContext.clientes.Where(x => x.Nombres.Contains(search)).AsQueryable();
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            return await queryable.Paginar(paginacionDTO).ToListAsync();
        }

        //METODO DEL API DE TIPO POST QUE CREA UN CLIENTE
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Clientes Cliente)
        {
            _aplicationDbContext.clientes.Add(Cliente);
            await _aplicationDbContext.SaveChangesAsync();
            return NoContent();
        }

        //METODO DEL API TIPO PUT QUE ACTUALIZA UN CLIENTE 
        [HttpPut("{id:int}")]
        public async Task<ActionResult> Put(int Id, [FromBody] Clientes clientes)
        {
            var cliente = await _aplicationDbContext.clientes.FirstOrDefaultAsync(x => x.id == Id);

            if (cliente == null)
            {
                return NotFound();
            }
            cliente.Nombres = clientes.Nombres;
            cliente.Direccion = clientes.Direccion;
            cliente.Genero = cliente.Genero;
            cliente.FechaNacimiento = clientes.FechaNacimiento;
            _aplicationDbContext.Entry(cliente).State = EntityState.Modified;
            await _aplicationDbContext.SaveChangesAsync();
            return NoContent();
        }

        //METODO DEL API TIPO DELETE QUE ELIMINA UN CLIENTE

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var existe = await _aplicationDbContext.clientes.AnyAsync(x => x.id == id);

            if (!existe)
            {
                return NotFound();
            }

            _aplicationDbContext.Remove(new Clientes() { id = id });
            await _aplicationDbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
