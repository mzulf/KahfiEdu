describe("Register Feature Test", () => {

  beforeEach(() => {
    cy.visit("/register");
  });

  it("Menampilkan halaman register dengan benar", () => {
    cy.contains(/register/i).should("exist");

    cy.contains(/name/i).parent().find("input").should("exist");
    cy.contains(/email/i).parent().find("input").should("exist");
    cy.contains(/^password/i).parent().find("input").should("exist");
    cy.contains(/confirm password/i).parent().find("input").should("exist");
    cy.contains(/syarat/i).should("exist");
  });

  it("Gagal register ketika semua field kosong", () => {
    cy.get('button[type="submit"]').should("be.disabled");
  });

  it("Validasi error ketika format email salah", () => {
    cy.contains(/name/i).parent().find("input").type("User");
    cy.contains(/email/i).parent().find("input").type("salah-email");
    cy.contains(/^password/i).parent().find("input").type("Abcdef1!");
    cy.contains(/confirm password/i).parent().find("input").type("Abcdef1!");

    cy.get('input[name="agree"]').check();

    cy.get('button[type="submit"]').should("not.be.disabled").click();

    // cek pesan error email
    cy.contains(/email/i)
      .parent()
      .find(".text-red-500, .text-red-600, span, p")
      .should("be.visible")
      .and(($el) => {
        expect($el.text().toLowerCase()).to.match(/email|format|valid/i);
      });
  });

  it("Validasi error ketika password terlalu lemah", () => {
    cy.contains(/name/i).parent().find("input").type("User");
    cy.contains(/email/i).parent().find("input").type("user@example.com");
    cy.contains(/^password/i).parent().find("input").type("abc");
    cy.contains(/confirm password/i).parent().find("input").type("abc");

    cy.get('input[name="agree"]').check();

    cy.get('button[type="submit"]').should("not.be.disabled").click();

    cy.contains(/password/i)
      .parent()
      .find(".text-red-500, .text-red-600, p, span")
      .should("be.visible");
  });

  it("Validasi error ketika confirm password tidak cocok", () => {
    cy.contains(/name/i).parent().find("input").type("User");
    cy.contains(/email/i).parent().find("input").type("user@example.com");
    cy.contains(/^password/i).parent().find("input").type("Abcdef1!");
    cy.contains(/confirm password/i).parent().find("input").type("beda123!");

    cy.get('input[name="agree"]').check();

    cy.get('button[type="submit"]').should("not.be.disabled").click();

    cy.contains(/confirm password/i)
      .parent()
      .find(".text-red-500, .text-red-600, p, span")
      .should("be.visible");
  });

  it("Berhasil register ketika semua field valid dan diarahkan ke halaman OTP", () => {
    cy.contains(/name/i).parent().find("input").type("John Doe");
    cy.contains(/email/i).parent().find("input").type("johndoe@example.com");
    cy.contains(/^password/i).parent().find("input").type("Abcdef1!");
    cy.contains(/confirm password/i).parent().find("input").type("Abcdef1!");

    cy.get('input[name="agree"]').check();

    cy.get('button[type="submit"]').should("not.be.disabled").click();

    cy.url().should("include", "/otp");
  });

});
