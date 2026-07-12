variable "app_name_front" {
  description = "Nom de l’application Fly front"
  type        = string
  default     = "cuisineensemble-front"
}

variable "app_name_back" {
  description = "Nom de l’application Fly back"
  type        = string
  default     = "cuisineensemble-back"
}

variable "supabase_project_ref" {
  description = "Référence du projet Supabase"
  type        = string
  default     = "replace-with-your-supabase-project-ref"
}
