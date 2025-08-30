# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}
variable "vpc_name" { default = "eks-vpc" }
variable "vpc_cidr" { default = "10.0.0.0/16" }
variable "public_subnets" {
  type    = list(string)
  default = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}
variable "private_subnets" {
  type    = list(string)
  default = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}
variable "environment" { default = "dev" }
variable "cluster_name" { default = "my-eks-cluster" }
variable "cluster_version" { default = "1.32" }
variable "node_instance_types" { type = list(string), default = ["t3.medium"] }
variable "node_min_size" { type = number, default = 1 }
variable "node_max_size" { type = number, default = 3 }
variable "node_desired_size" { type = number, default = 2 }
