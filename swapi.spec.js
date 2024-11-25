const request = require("supertest");

test("Deve visualizar informações de cadastro, quando buscar por uma pessoa existente", async () => {
  const resposta = await request("https://swapi.dev/api").get("/people/1");
  expect(resposta.status).toBe(200);
  expect(resposta.body.films).toBeDefined();
  expect(resposta.body.vehicles.length).toBeGreaterThan(0);
  expect(resposta.body.name).toBe("Luke Skywalker");
});

test("Deve receber uma mensagem de erro, quando buscar por uma pessoa inexistente", async () => {
  const resposta = await request("https://swapi.dev/api").get("/people/9999");
  expect(resposta.status).toBe(404);
  expect(resposta.body.detail).toBe("Not found");
  expect(resposta.body).toMatchObject({
    detail: "Not found",
  });
});

describe("SWAPI - Testes de Planetas", () => {
  test("Deve retornar informações do planeta Tatooine", async () => {
    const resposta = await request("https://swapi.dev/api").get("/planets/1");
    expect(resposta.status).toBe(200);
    expect(resposta.body.name).toBe("Tatooine");
    expect(resposta.body.climate).toBeDefined();
    expect(resposta.body.terrain).toBeDefined();
  });

  test("Deve retornar erro para planeta inexistente", async () => {
    const resposta = await request("https://swapi.dev/api").get(
      "/planets/9999"
    );
    expect(resposta.status).toBe(404);
  });
});

describe("SWAPI - Testes de Naves", () => {
  test("Deve retornar informações da Millennium Falcon", async () => {
    const resposta = await request("https://swapi.dev/api").get(
      "/starships/10"
    );
    expect(resposta.status).toBe(200);
    expect(resposta.body.name).toBe("Millennium Falcon");
    expect(resposta.body.model).toBeDefined();
    expect(resposta.body.manufacturer).toBeDefined();
  });

  test("Deve retornar erro para nave inexistente", async () => {
    const resposta = await request("https://swapi.dev/api").get(
      "/starships/9999"
    );
    expect(resposta.status).toBe(404);
  });
});

describe("SWAPI - Testes de Filmes", () => {
  test("Deve retornar informações do primeiro filme", async () => {
    const resposta = await request("https://swapi.dev/api").get("/films/1");
    expect(resposta.status).toBe(200);
    expect(resposta.body.title).toBeDefined();
    expect(resposta.body.episode_id).toBeDefined();
    expect(resposta.body.director).toBeDefined();
  });

  test("Deve retornar erro para filme inexistente", async () => {
    const resposta = await request("https://swapi.dev/api").get("/films/999");
    expect(resposta.status).toBe(404);
  });
});

describe("SWAPI - Testes de Espécies", () => {
  test("Deve retornar informações detalhadas de uma espécie específica", async () => {
    const resposta = await request("https://swapi.dev/api").get("/species/1");

    expect(resposta.status).toBe(200);

    expect(resposta.body.name).toBeDefined();
    expect(resposta.body.classification).toBeDefined();
    expect(resposta.body.designation).toBeDefined();

    expect(Array.isArray(resposta.body.people)).toBe(true);
    expect(Array.isArray(resposta.body.films)).toBe(true);

    expect(resposta.body.language).toBeDefined();
    expect(resposta.body.average_lifespan).toBeDefined();

    expect(resposta.body.average_height).toBeDefined();
    expect(resposta.body.skin_colors).toBeDefined();
    expect(resposta.body.hair_colors).toBeDefined();
    expect(resposta.body.eye_colors).toBeDefined();
  });

  test("Deve retornar erro para espécie com ID inválido", async () => {
    const resposta = await request("https://swapi.dev/api").get(
      "/species/999999"
    );

    expect(resposta.status).toBe(404);
    expect(resposta.body.detail).toBe("Not found");
  });
});

describe("SWAPI - Testes de Busca", () => {
  test("Deve retornar resultados ao pesquisar por uma nave específica", async () => {
    const searchTerm = "wing";
    const resposta = await request("https://swapi.dev/api").get(
      `/starships/?search=${searchTerm}`
    );

    expect(resposta.status).toBe(200);

    expect(resposta.body.count).toBeDefined();
    expect(Array.isArray(resposta.body.results)).toBe(true);

    expect(resposta.body.results.length).toBeGreaterThan(0);

    resposta.body.results.forEach((ship) => {
      expect(
        ship.name.toLowerCase().includes(searchTerm) ||
          ship.model.toLowerCase().includes(searchTerm)
      ).toBe(true);
    });
  });

  test("Deve retornar lista vazia ao pesquisar por termo inexistente", async () => {
    const resposta = await request("https://swapi.dev/api").get(
      "/starships/?search=impossibleshipthatdoesntexist123"
    );

    expect(resposta.status).toBe(200);
    expect(resposta.body.count).toBe(0);
    expect(resposta.body.results).toHaveLength(0);
  });
});

describe("SWAPI - Testes de Rotas Inválidas", () => {
  test("Deve retornar erro para rota inexistente", async () => {
    const resposta = await request("https://swapi.dev/api").get("/heroes");
    expect(resposta.status).toBe(404);
  });

  test("Deve retornar erro para método não suportado", async () => {
    const resposta = await request("https://swapi.dev/api").post("/people/1");
    expect(resposta.status).toBe(405);
  });
});
