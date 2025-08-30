# outputs.tf
output "cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "API server endpoint"
}
output "cluster_certificate_authority_data" {
  value       = module.eks.cluster_certificate_authority_data
  description = "CA for kubeconfig"
}
output "cluster_name" {
  value       = module.eks.cluster_name
  description = "Name of the cluster"
}
