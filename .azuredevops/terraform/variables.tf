# General
variable "general__resource_group_name" {
    type = string
    description = "The resource group name"
}

variable "general__location" {
    type = string
    description = "The azure region"
    default = "West Europe"
}

# Storage Account
variable "storage_account__name" {
    type = string
    description = "The name of the azure storage account for floodrunner data"
}