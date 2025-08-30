# terraform.tfvars — Optimized for AWS Free Tier usage

aws_region      = "us-east-1" # Free Tier friendly region
vpc_name        = "eks-vpc-dev"
vpc_cidr        = "10.0.0.0/16"
public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"] # Two subnets in different AZs
private_subnets = ["10.0.11.0/24", "10.0.12.0/24"]
environment     = "dev"
cluster_name    = "free-tier-eks-cluster"
cluster_version = "1.32"

# Use Free Tier eligible instance type (t3.micro supported generally) :contentReference[oaicite:0]{index=0}
node_instance_types = ["m7i-flex.large"]
node_min_size       = 1
node_desired_size   = 1
node_max_size       = 1
