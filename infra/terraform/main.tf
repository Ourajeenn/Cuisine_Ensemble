terraform {
  required_version = ">= 1.7.0"
}

locals {
  environment = "production"
  supabase = {
    project_ref   = "replace-with-your-supabase-project-ref"
    postgres_host = "db.replace-with-your-project.supabase.co"
    postgres_port = 5432
    postgres_db   = "postgres"
  }

  fly = {
    front = {
      app_name     = "cuisineensemble-front"
      region       = "cdg"
      internal_port = 3000
    }
    back = {
      app_name     = "cuisineensemble-back"
      region       = "cdg"
      internal_port = 8080
    }
  }
}

output "environment" {
  value = local.environment
}

output "supabase_project_ref" {
  value = local.supabase.project_ref
}

output "fly_front_app" {
  value = local.fly.front.app_name
}

output "fly_back_app" {
  value = local.fly.back.app_name
}
