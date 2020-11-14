/*

Description:
----
FloodRunner Terraform script to deploy and configure FloodRunner

Terraform Commands:
---

Initializing Terraform:
terraform init -backend-config="./variables/dev.backend.tfvars"

Plan:
terraform plan -var-file="./variables/dev.tfvars"

Execute:
terraform apply -var-file="./variables/dev.tfvars"
*/

# Configure Azure provider
terraform {
    required_providers {
        azurerm = {
            source = "hashicorp/azurerm"
            version = "=2.26"
        }
    }

    backend "azurerm" {
    }    
}

provider "azurerm" {
    skip_provider_registration = true
    features {}
}

# Create resource group
resource "azurerm_resource_group" "rg" {
  name     = var.general__resource_group_name
  location = var.general__location
}

# Create azure storage account
resource "azurerm_storage_account" "storage" {
  name                     = var.storage_account__name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  blob_properties {
      cors_rule {
          allowed_headers = ["*"]
          allowed_methods = ["GET"]
          allowed_origins = ["*"]
          exposed_headers = ["*"]
          max_age_in_seconds = 600
      }
  }
  tags = {
    environment = "development"
  }
}



# resource "azure_storage_service" "storage_account" {
#     name         =  var.storage_account__name
#     location     =  var.general__location
#     account_type = "Standard_LRS"
# }

