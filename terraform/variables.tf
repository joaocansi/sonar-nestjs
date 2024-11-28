variable "commit" {default = ""}

locals {
  commit = var.commit
  docker_image = "joaocansi/nestjs-app"
}
