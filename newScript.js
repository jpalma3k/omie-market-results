var objetoTipos = [
    {parents1: 'Mercado Diário',
    tipos: [
        { parents2: '1. Preços',
            items: [
                {dir: 'Preços diários do mercado por hora na Espanha', realdir: 'marginalpdbc'} , 
                {dir: 'Preços por hora do mercado diário em Portugal', realdir: 'marginalpdbcpt'}
            ]
        },
        { parents2: '2. Programas',
            items: [
                {dir: 'Programa base de correspondência diária em espanhol', realdir: 'pdbc'},
                {dir: 'Programa base diário por empresa', realdir: 'pdbce'},
                {dir: 'Programa base de correspondência diária em português', realdir: 'pdbcpt'},
                {dir: 'Programa base operacional diário', realdir: 'pdbf'},
                {dir: 'Programa diário final viável', realdir: 'pdvd', },
                {dir: 'Energia total decomposta após o mercado diário', realdir: 'pdbc_stota'}, 
                {dir: 'Energia total negociada no mercado, regime bilateral e especial após o mercado diário', realdir: 'pdbc_tot'},
                {dir: 'Mercado total, energia de regime bilateral e especial no programa operacional diário', realdir: 'pdbf_tot'}
            ]
        },{ parents2: '3. Curvas',
        items: [
            {dir:'Curvas de oferta e demanda agregadas do mercado diário', realdir: 'curva_pbc'},
            {dir:'Arquivos mensais com curvas agregadas de oferta e demanda do mercado diário, incluindo unidades de suprimento', realdir: 'curva_pbc_uof'}
        ]
        },{ parents2: '4. Ofertas',
        items: [
            {dir:'Cabeçalho de ofertas para o mercado diário', realdir: 'cab'},
            {dir:'Detalhe das ofertas para o mercado diário', realdir: 'det'}
        ]
        },{ parents2: '5. Comum',
        items: [
            {dir:'Arquivos publicados nos últimos 10 dias', realdir: 'comun'},
            {dir:'Últimos arquivos mensais publicados', realdir: 'comunzip'}
        ]
        },{ parents2: '6. Capacidades',
        items: [
            {dir:'Capacidade e ocupação mensal de interconexões após o mercado diário', realdir: 'capacidad_inter_mes'},
            {dir:'Capacidade e ocupação de interconexões após a correspondência do mercado diário', realdir: 'capacidad_inter_pbc' },
            {dir:'Capacidade e ocupação das interconexões após as restrições do mercado diário', realdir: 'capacidad_inter_pvp'},
        ]
        },{ parents2: '7. Indisponibilidade',
        items: [
            {dir:'Declaração de indisponibilidade de unidades portuguesas', realdir: 'indisppt'}
        ]
        },
    ]},
    {parents1: 'Mercado IntraDiário',
    tipos: [
        { parents2: '1. Preços',
            items: [                
                {dir:'Preços por hora do mercado de leilão intradia na Espanha', realdir: 'marginalpibc'},
                {dir:'Preços por hora do mercado de leilão intradiário em Portugal', realdir: 'marginalpibcpt'}
            ]
        },
        { parents2: '2. Programas',
            items: [
                {dir:'Programação final', realdir: 'phf'},
                {dir:'Energias acumuladas por unidade de suprimento após cada sessão do mercado intradiário de leilões', realdir: 'pibca'},
                {dir:'Energias incrementais das unidades espanholas em cada sessão do mercado intradiário de leilões', realdir: 'pibci'},
                {dir:'Energias incrementais das unidades portuguesas em cada sessão do mercado intradiário de leilões', realdir: 'pibcipt'},
                {dir:'Energia total desagregada após o mercado intradiário de leilões', realdir: 'contratacion_stota'},
                {dir:'Energia total discriminada por sessão após o mercado intradiário de leilões', realdir: 'phf_stota'},
                {dir:'Total de energia negociada após o mercado intradiário de leilões', realdir: 'phf_tot'},
                {dir:'Total de energias incrementais em cada mercado intradiário de leilões', realdir: 'pibci_tot'}
            ]
        },{ parents2: '3. Curvas',
        items: [
            {dir:'Curvas agregadas de oferta e demanda do mercado intradiário de leilões', realdir: 'curva_pibc'},
            {dir:'Arquivos mensais com curvas agregadas de oferta e demanda do mercado intradiário de leilões, incluindo unidades de suprimento', realdir: 'curva_pibc_uof'}
        ]
        },{ parents2: '4. Ofertas',
        items: [
            {dir:'Cabeçalho das licitações para o mercado de leilões', realdir: 'icab'},
            {dir:'Detalhe das ofertas para o mercado de leilões', realdir: 'idet'},
            {dir:'Limitações em unidades espanholas', realdir: 'limitaciones'},
            {dir:'Limitações das unidades portuguesas', realdir: 'limitacionespt'}
        ]
        },{ parents2: '5. Comum',
        items: [
            {dir:'Arquivos publicados nos últimos 10 dias', realdir: 'comun'}
        ]
        },{ parents2: '6. Capacidades',
        items: [
            {dir:'Capacidade e ocupação de interconexões após mercado intradiários', realdir: 'capacidad_inter_phf'}
        ]
        },{ parents2: '7. Indisponibilidade',
        items: [
            {dir:'Declaração de indisponibilidade de unidades portuguesas', realdir: 'indisppt'}
        ]
        },
    ]}
]

const axios = require('axios');
var url = require('url')
var fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

var baseAdr = 'www.omie.es/pt/file-access-list';

let parsedUrl = url.parse(baseAdr, true)
var date = new Date(2023, 4, 21)
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
const year = date.getFullYear();

var filename = ''
var downloadURLs=[]


async function getURLS() {
    for (var i = 0; i < objetoTipos.length; i++) {
        var parents1 = objetoTipos[i].parents1;
        for (var j = 0; j < objetoTipos[i].tipos.length; j++) {
            var parents2 = objetoTipos[i].tipos[j].parents2;
            for (var k = 0; k < objetoTipos[i].tipos[j].items.length; k++) {
                var dir = objetoTipos[i].tipos[j].items[k].dir;
                var realdir = objetoTipos[i].tipos[j].items[k].realdir;
                query = {
                    'parents[0]': '/',
                    'parents[1]': parents1, // apresentar mercado em questão
                    'parents[2]': parents2, // colocar número mais nome da categoria i.e. '1. Preços'
                    dir: dir, // colocar nome do tipo de ficheiro i.e. 'Horas canceladas no programa de horário final português pelo operador do sistema'
                    realdir: realdir //filename do ficheiro a fazer download sem a data i.e. 'osanulaintrapt'
                  }
                var constructedTableUrl = url.format({
                    protocol: 'http',
                    hostname: baseAdr, 
                    query: query
                });
                const response = await axios.get(constructedTableUrl)
                const html = response.data;
                const cheerioLoad = cheerio.load(html); 
                const table = cheerioLoad('table')
                table.find('tr').each((index,element) => {
                    const tds = cheerioLoad(element).find('td');
                    const filename = cheerioLoad(tds[0]).text();
                    const dateCol = cheerioLoad(tds[2]).text();
                    dateText=dateCol.slice(0,10)
                    htmlDay = dateText.slice(0,2)
                    htmlMon = dateText.slice(3,5)
                    htmlYear = dateText.slice(6,10)
                    if(dateText == `${day}/${month}/${year}`) {
                        console.log(dir, filename, dateCol)
                        queryDownload = {
                            'parents[0]': realdir,
                            filename: filename //preciso de arranjar o filename no url de cima
                          }
                        var constructedFileUrl = url.format({
                            protocol: 'http',
                            hostname: 'www.omie.es/pt/file-download', 
                            query: queryDownload
                        });
                        downloadURLs.push({url: constructedFileUrl, name: filename, folder:`${year}_${month}_${day}`})
                    } else if (dateCol != '' && htmlYear<year || dateCol != '' &&  htmlMon < month && year == htmlYear){
                        return false; //leave loop
                    } 
                });
            }
        }
    console.log(downloadURLs)
    }
    return downloadURLs
}

async function downloadFile(fileUrl) {
    try {
        const response = await axios({
            method: 'GET',
            url: fileUrl.url,
            responseType: 'stream',
        });

        const fileName = path.basename(fileUrl.name);

        // const folderName = `./omieFiles/${year}_${month}_${day}`;
        const folderName = `./omieFiles`;

        // if (!fs.existsSync('./omieFiles')) {
        //     fs.mkdirSync('./omieFiles', { recursive: true });
        // }

        // // Create the folder if it doesn't exist
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true });
        }

        const filePath = path.resolve(folderName, fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (err) {
        console.error(`Error downloading file from ${fileUrl}:`, err);
    }
}

async function downloadFiles(urls) {
    const downloadPromises = urls.map(url => downloadFile(url));
    await Promise.all(downloadPromises);
}

// downloadFiles(downloadURLs);

  getURLS().then(downloadURLs => {
    downloadFiles(downloadURLs);
}).catch(err => {
    console.error(`Error: ${err}`);
});