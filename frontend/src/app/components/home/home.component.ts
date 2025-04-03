import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  presentationForm: FormGroup
  submitted = false
  errorMessage = ""

  private uuidPattern = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.presentationForm = this.formBuilder.group({
      presentationId: ["", [Validators.required, Validators.pattern(this.uuidPattern)]],
    })
  }

  get f() {
    return this.presentationForm.controls
  }

  onSubmit() {
    this.submitted = true
    this.errorMessage = ""

    if (this.presentationForm.invalid) {
      return
    }

    const fullId = this.presentationForm.value.presentationId

    this.router.navigate(["/", fullId])
  }
}

