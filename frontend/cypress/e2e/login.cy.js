describe("Login Feature Test", () => {

  beforeEach(() => {
    cy.visit("/login");
  });

  it("Menampilkan halaman login dengan benar", () => {
    cy.contains(/log in/i).should("exist");

    cy.contains(/email/i)
      .parent()
      .find("input")
      .should("exist");

    cy.contains(/password/i)
      .parent()
      .find("input")
      .should("exist");
  });

  it("Gagal login ketika field kosong", () => {
    cy.get('button[type="submit"]').click();

    // tetap di halaman login
    cy.url().should("include", "/login");
  });

  it("Gagal login ketika email atau password salah", () => {
    cy.contains(/email/i).parent().find("input").type("wrong@example.com");
    cy.contains(/password/i).parent().find("input").type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // tetap di halaman login
    cy.url().should("include", "/login");
  });

  it("Berhasil login dan diarahkan ke halaman siswa", () => {
    cy.contains(/email/i).parent().find("input").type("student@example.com");
    cy.contains(/password/i).parent().find("input").type("12345678");

    cy.get('button[type="submit"]').click();

    // harus ke halaman siswa
    cy.url().should("include", "/siswa");
  });
});
