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
    [Route("api/clientes")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ClientesController : Controller
    {
        private readonly AplicationDbContext _aplicationDbContext;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ClientesController(AplicationDbContext aplicationDbContext, IWebHostEnvironment webHostEnvironment)
        {
            _aplicationDbContext = aplicationDbContext;
            _webHostEnvironment = webHostEnvironment;
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        }

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
        [AllowAnonymous]
        [HttpGet("reporte/{Id:int}")]
        public ActionResult reporte(int Id)
        {
            string mimetype = "";
            int extension = 1;
            var path = $"{this._webHostEnvironment.WebRootPath}\\report\\EstadoCuenta.rdlc";
            var data = _aplicationDbContext.OrdenesVentas.Where(x => x.idCliente == Id).ToList();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            //parameters.Add("","")
            LocalReport localReport = new LocalReport(path);
            localReport.AddDataSource("DataSet1", data);
            if (parameters != null && parameters.Count > 0)// if you use parameter in report
            {
                List<ReportParameter> reportparameter = new List<ReportParameter>();
                foreach (var record in parameters)
                {
                    reportparameter.Add(new ReportParameter());
                }

            }
            var result = localReport.Execute(RenderType.Pdf, extension, parameters, mimetype);
            return File(result.MainStream,"application/pdf");
        }


        [HttpGet] 
        public async Task<ActionResult<List<Clientes>>> Get([FromQuery] PaginacionDTO paginacionDTO)
        {
            var queryable = _aplicationDbContext.clientes.Take(25000).AsQueryable();
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            return await queryable.Paginar(paginacionDTO).ToListAsync();           
        }

        [HttpGet("filtro")]
        public async Task<ActionResult<List<Clientes>>> filtro([FromQuery] PaginacionDTO paginacionDTO, string search)
        {
            var queryable = _aplicationDbContext.clientes.Where(x => x.Nombres.Contains(search)).AsQueryable();
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            return await queryable.Paginar(paginacionDTO).ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Clientes Cliente)
        {
            _aplicationDbContext.clientes.Add(Cliente);
            await _aplicationDbContext.SaveChangesAsync();
            return NoContent();
        }

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
