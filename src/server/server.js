import { belongsTo, createServer, hasMany, Model, RestSerializer } from 'miragejs'

export default function makeServer() {
  createServer({
    models: {
      apolice: Model.extend({
        segurado: belongsTo(),
        coberturas: hasMany(),
      }),
      segurado: Model,
      cobertura: Model
    },

    serializers: {
      application: RestSerializer,
    },

    routes() {
      this.namespace = 'api'

      this.get('/apolices', function (schema, request) {
        let apolices = schema.apolices.all();
        const page = request.queryParams["page"];
        const size = request.queryParams["size"];
        const search = request.queryParams["search"];
        const apolicesSerialized = this.serialize(apolices);
        let apolicesPopulated = [];
        let apolicesForCurrentPage;
        let totalPages;

        apolicesSerialized.apolices.forEach(apolice => {
          const segurado = schema.segurados.find(apolice.segurado);
          const seguradoSerialized = this.serialize(segurado);
          const coberturas = schema.coberturas.find(apolice.coberturas);
          const coberturasSerialized = this.serialize(coberturas);

          apolicesPopulated.push({ id: apolice.id, numero: apolice.numero, valor_premio: apolice.valorPremio, segurado: seguradoSerialized.segurado, coberturas: coberturasSerialized.coberturas });
        })

        let totalApolices = apolicesPopulated.length;

        if(search) {
          apolicesPopulated = filterData(apolicesPopulated, search);
          totalApolices = apolicesPopulated.length;
        }

        if (page && size) {
          let pageNumber = Number(page);
          let pageSize = Number(size);
          totalPages = Math.ceil(apolicesPopulated.length / pageSize);
          let fromIndex = (pageNumber - 1) * pageSize;
          apolicesForCurrentPage = apolicesPopulated.splice(fromIndex, pageSize);
        }

        return {
          content: apolicesForCurrentPage,
          page,
          totalItens: totalApolices,
          totalPages: totalPages
        }
      })

      this.get('/apolices/:id', (schema, request) => {
        const id = request.params.id;
        return schema.find("apolice", id);
      })

      this.post("/apolices", (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        const apolice = { numero: attrs.numero, valor_premio: attrs.valor_premio }
        const segurado = { nome: attrs.segurado.nome, email: attrs.segurado.email, cpf_cnpj: attrs.segurado.cpfCnpj}
        const coberturaIds = [];
        attrs.coberturas.forEach((cobertura) => {
          const newCobertura = schema.coberturas.create({ nome: cobertura.nome, valor: cobertura.valor });
          coberturaIds.push(newCobertura.attrs.id);
        })
        
        const apoliceSaved = schema.apolices.create(apolice)
        apoliceSaved.createSegurado(segurado)
        apoliceSaved.coberturaIds = coberturaIds;
        apoliceSaved.save()
      })
      
      this.put("/apolices/:id", (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody)
        const id = request.params.id
        const oldApolice = schema.apolices.find(id)
        const apolice = { numero: newAttrs.numero, valor_premio: newAttrs.valor_premio }
        const segurado = { nome: newAttrs.segurado.nome, email: newAttrs.segurado.email, cpf_cnpj: newAttrs.segurado.cpfCnpj }
        const oldCoberturas = newAttrs.coberturas.filter(cobertura => cobertura.id !== 0);
        const newCoberturas = newAttrs.coberturas.filter(cobertura => cobertura.id === 0);
        
        schema.segurados.find(oldApolice.seguradoId).update(segurado);
        oldCoberturas.forEach(cobertura => {
          const coberturaWithoutId = { nome: cobertura.nome, valor: cobertura.valor }
          schema.coberturas.find(cobertura.id).update(coberturaWithoutId)
        });
        const coberturaIds = [...oldApolice.coberturaIds];
        newCoberturas.forEach((cobertura) => {
          const newCobertura = schema.coberturas.create({ nome: cobertura.nome, valor: cobertura.valor });
          coberturaIds.push(newCobertura.attrs.id);
        })

        oldApolice.update(apolice)
        oldApolice.coberturaIds = coberturaIds;
        oldApolice.save()
      })

      this.delete('/apolices/:id', (schema, request) => {
        let id = request.params.id
        return schema.apolices.find(id).destroy()
      })
    },

    seeds(server) {
      server.create("apolice", { numero: 1, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva', email: 'ritadecassia@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 2, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva2', email: 'ritadecassia2@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 3, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva3', email: 'ritadecassia3@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 4, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva4', email: 'ritadecassia4@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 5, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva5', email: 'ritadecassia5@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 6, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva6', email: 'ritadecassia6@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 7, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva7', email: 'ritadecassia7@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 8, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva8', email: 'ritadecassia8@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 9, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva9', email: 'ritadecassia9@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 10, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva10', email: 'ritadecassia10@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 11, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva11', email: 'ritadecassia11@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 12, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva12', email: 'ritadecassia12@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
      server.create("apolice", { numero: 13, valor_premio: 100, segurado: server.create("segurado", { nome: 'Rita de Cassia da Silva13', email: 'ritadecassia13@email.com', cpf_cnpj: '123.456.789-00' }), coberturas: [server.create("cobertura", { nome: "Incêndio", valor: 14 })] })
    }
  })
}

const filterData = (data, str) => {
  const stringIncludes = (value) => {
    if (Array.isArray(value)) {
      return false;
    } else if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(stringIncludes);
    } else {
      return String(value).toLowerCase().includes(str.toLowerCase());
    }
  };

  return data.filter(item => {
    return Object.entries(item).some(([key, value]) => {
      if (Array.isArray(value)) {
        return false;
      }
      return stringIncludes(value);
    });
  });
};