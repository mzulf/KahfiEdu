describe("Admin Blog Create - Test Valid, Kurang, Lebih", () => {

  beforeEach(() => {
    // Login
    cy.visit("/admin/login");

    cy.get('input[name="email"]').type("admin@example.com");
    cy.get('input[name="password"]').type("12345678");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/admin/dashboard");

    // Masuk halaman create
    cy.visit("/admin/blog/create");
  });

  // ----------------------------------------------------
  // POSITIF / VALID
  // ----------------------------------------------------
  it("Berhasil membuat blog dengan title & description valid", () => {
    cy.get('input[name="title"]').type("Ini contoh judul blog yang valid minimal 20 karakter");
    cy.get('textarea[name="description"]').type("A".repeat(150));

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/admin/blog");
  });

  // ----------------------------------------------------
  // NEGATIF: KURANG DARI MINIMAL KARAKTER
  // ----------------------------------------------------
  it("Gagal jika title kurang dari minimal karakter", () => {
    cy.get('input[name="title"]').type("judul pendek");
    cy.get('textarea[name="description"]').type("A".repeat(150));

    cy.get('button[type="submit"]').click();

    cy.contains("Judul minimal 20 karakter").should("exist");
  });

  it("Gagal jika description kurang dari minimal karakter", () => {
    cy.get('input[name="title"]').type("Ini contoh judul blog yang valid minimal 20 karakter");
    cy.get('textarea[name="description"]').type("A".repeat(50));

    cy.get('button[type="submit"]').click();

    cy.contains("Deskripsi minimal 100 karakter").should("exist");
  });

  // ----------------------------------------------------
  // NEGATIF: LEBIH DARI MAKSIMAL KARAKTER
  // ----------------------------------------------------
  it("Gagal jika title lebih dari maksimal karakter", () => {
    cy.get('input[name="title"]').type("A".repeat(150));
    cy.get('textarea[name="description"]').type("A".repeat(150));

    cy.get('button[type="submit"]').click();

    cy.contains("Judul maksimal 100 karakter").should("exist");
  });

  it("Gagal jika description lebih dari maksimal karakter", () => {
    cy.get('input[name="title"]').type("Ini contoh judul blog yang valid minimal 20 karakter");
    cy.get('textarea[name="description"]').type("A".repeat(2000));

    cy.get('button[type="submit"]').click();

    cy.contains("Deskripsi maksimal 1000 karakter").should("exist");
  });

});
