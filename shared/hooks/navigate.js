import LuigiClient from '@luigi-project/client';

function navigateToResourceDetails(resourceName) {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate('/details/' + resourceName);
}

export function navigateToFixedPathResourceDetails(
  namespaceName,
  resourceType,
  resourceName,
) {
  LuigiClient.linkManager().navigate(
    `/home/namespaces/${namespaceName}/${resourceType}/details/${resourceName}`,
  );
}

function navigateToNamespaceDetails(namespaceName) {
  LuigiClient.linkManager().navigate(
    `/home/namespaces/${namespaceName}/details`,
  );
  LuigiClient.sendCustomMessage({ id: 'busola.refreshNavigation' });
}

export function navigateToDetails(resourceType, name) {
  const encodedName = encodeURIComponent(name);
  switch (resourceType) {
    case 'Namespaces':
      navigateToNamespaceDetails(encodedName);
      break;
    default:
      navigateToResourceDetails(encodedName);
  }
}
export function navigateFromDetailsToDetails(resourceType, name) {
  const encodedName = encodeURIComponent(name);
  switch (resourceType) {
    case 'Namespaces':
      navigateToNamespaceDetails(encodedName);
      break;
    default:
      navigateToResourceDetails(encodedName);
  }
}

function navigateToResourceList() {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate('/');
}

function navigateToNamespaceList() {
  LuigiClient.linkManager().navigate('/');
  LuigiClient.sendCustomMessage({ id: 'busola.refreshNavigation' });
}

export function navigateToList(resourceType) {
  switch (resourceType) {
    case 'Namespaces':
      navigateToNamespaceList();
      break;
    default:
      navigateToResourceList();
  }
}