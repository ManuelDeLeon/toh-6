import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, DebugElement } from "@angular/core";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";
import { By } from "@angular/platform-browser";
describe("HeroesComponent", () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  beforeEach(() => {
    const heroStub = {};
    const heroServiceStub = {
      getHeroes: () => ({ subscribe: () => ({}) }),
      addHero: hero => ({ subscribe: f => f(hero) }),
      deleteHero: () => ({ subscribe: () => ({}) })
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HeroesComponent],
      providers: [
        { provide: Hero, useValue: heroStub },
        { provide: HeroService, useValue: heroServiceStub }
      ]
    });
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
  });
  it("can load instance", () => {
    expect(component).toBeTruthy();
  });
  describe("delete", () => {
    it("makes expected calls", () => {
      const heroStub: Hero = fixture.debugElement.injector.get(Hero);
      const heroServiceStub: HeroService = fixture.debugElement.injector.get(HeroService);
      spyOn(heroServiceStub, "deleteHero").and.callThrough();
      component.delete(heroStub);
      expect(heroServiceStub.deleteHero).toHaveBeenCalledWith(heroStub);
    });
  });
  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getHeroes").and.callThrough();
      component.ngOnInit();
      expect(component.getHeroes).toHaveBeenCalled();
    });
  });
  describe("getHeroes", () => {
    it("makes expected calls", () => {
      const heroStub: Hero = fixture.debugElement.injector.get(Hero);
      const heroServiceStub: HeroService = fixture.debugElement.injector.get(HeroService);
      spyOn(heroServiceStub, "getHeroes").and.returnValue({
        subscribe(f) {
          f([heroStub]);
        }
      });
      component.getHeroes();
      expect(component.heroes.length).toBe(1);
      expect(component.heroes[0]).toBe(heroStub);
    });
  });

  describe("use cases", () => {
    it("clears input when addHero is clicked", () => {
      const inputName: HTMLInputElement = fixture.debugElement.query(By.css("input")).nativeElement;
      inputName.value = "Alan";
      const buttonAdd: HTMLButtonElement = fixture.debugElement.query(By.css("div > button"))
        .nativeElement;
      buttonAdd.click();
      fixture.detectChanges();
      expect(inputName.value).toBe("");
    });

    it("adds hero to list", () => {
      const inputName: HTMLInputElement = fixture.debugElement.query(By.css("input")).nativeElement;
      inputName.value = "Alan";
      const buttonAdd: HTMLButtonElement = fixture.debugElement.query(By.css("div > button"))
        .nativeElement;
      buttonAdd.click();
      inputName.value = "Brito";
      buttonAdd.click();
      fixture.detectChanges();

      const links: Array<DebugElement> = fixture.debugElement.queryAll(By.css("a"));
      expect(links.length).toBe(2);
      const linkAlan: HTMLAnchorElement = links[0].nativeElement;
      expect(linkAlan.text).toContain("Alan");
      const linkBrito: HTMLAnchorElement = links[1].nativeElement;
      expect(linkBrito.text).toContain("Brito");
    });

    it("doesn't add a blank hero to list", () => {
      const inputName: HTMLInputElement = fixture.debugElement.query(By.css("input")).nativeElement;
      inputName.value = "    ";
      const buttonAdd: HTMLButtonElement = fixture.debugElement.query(By.css("div > button"))
        .nativeElement;
      buttonAdd.click();
      fixture.detectChanges();

      const links: Array<DebugElement> = fixture.debugElement.queryAll(By.css("a"));
      expect(links.length).toBe(0);
    });

    it("deletes a hero from the list", () => {
      const inputName: HTMLInputElement = fixture.debugElement.query(By.css("input")).nativeElement;
      inputName.value = "Alan";
      const buttonAdd: HTMLButtonElement = fixture.debugElement.query(By.css("div > button"))
        .nativeElement;
      buttonAdd.click();
      inputName.value = "Brito";
      buttonAdd.click();
      fixture.detectChanges();

      const buttonDelete: HTMLButtonElement = fixture.debugElement.query(By.css("li > button"))
        .nativeElement;
      buttonDelete.click();
      fixture.detectChanges();

      const links: Array<DebugElement> = fixture.debugElement.queryAll(By.css("a"));
      expect(links.length).toBe(1);
      const link: HTMLAnchorElement = links[0].nativeElement;
      expect(link.text).toContain("Brito");
    });
  });
});
