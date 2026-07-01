import { Routes, Route, Navigate } from 'react-router-dom'
import { CustomerProvider } from './context/CustomerContext'
import { PortalAuthProvider } from './context/PortalAuthContext'
import { ResellerAuthProvider } from './context/ResellerAuthContext'
import { TeamProvider } from './context/TeamContext'
import { AppLayout } from './components/layout/Sidebar'
import { ResellerGuard } from './components/reseller/ResellerGuard'
import { PortalGuard } from './components/portal/PortalGuard'
import { PortalLayout } from './components/portal/PortalLayout'
import { HomePage } from './pages/HomePage'
import { ResellerLoginPage } from './pages/ResellerLogin'
import { DashboardPage } from './pages/Dashboard'
import { CustomersPage } from './pages/Customers'
import { CustomerDetailPage } from './pages/CustomerDetail'
import { CatalogPage } from './pages/Catalog'
import { ProvisionPage } from './pages/Provision'
import { SubscriptionsPage } from './pages/Subscriptions'
import { SettingsPage, HelpPage } from './pages/Settings'
import { TeamPage } from './pages/Team'
import { PortalLoginPage } from './pages/portal/PortalLogin'
import { PortalDashboardPage } from './pages/portal/PortalDashboard'
import { PortalProductsPage } from './pages/portal/PortalProducts'
import { PortalLicensesPage } from './pages/portal/PortalLicenses'
import { PortalUsersPage } from './pages/portal/PortalUsers'
import { PortalSupportPage } from './pages/portal/PortalSupport'

import { AiAssistantProvider } from './context/AiAssistantContext'
import { AiAssistantPanel, AiAssistantFab } from './components/ai/AiAssistantPanel'

function ResellerApp() {
  return (
    <AiAssistantProvider>
      <AppLayout>
        <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/provision" element={<ProvisionPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
      <AiAssistantPanel />
      <AiAssistantFab />
    </AiAssistantProvider>
  )
}

function CustomerPortalApp() {
  return (
    <PortalLayout>
      <Routes>
        <Route index element={<PortalDashboardPage />} />
        <Route path="products" element={<PortalProductsPage />} />
        <Route path="licenses" element={<PortalLicensesPage />} />
        <Route path="users" element={<PortalUsersPage />} />
        <Route path="support" element={<PortalSupportPage />} />
      </Routes>
    </PortalLayout>
  )
}

export default function App() {
  return (
    <ResellerAuthProvider>
      <CustomerProvider>
        <TeamProvider>
          <PortalAuthProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<ResellerLoginPage />} />
              <Route path="/portal/login" element={<PortalLoginPage />} />

              {/* Customer portal (authenticated) */}
              <Route
                path="/portal/*"
                element={
                  <PortalGuard>
                    <CustomerPortalApp />
                  </PortalGuard>
                }
              />

              {/* Reseller portal (authenticated) */}
              <Route
                path="/*"
                element={
                  <ResellerGuard>
                    <ResellerApp />
                  </ResellerGuard>
                }
              />
            </Routes>
          </PortalAuthProvider>
        </TeamProvider>
      </CustomerProvider>
    </ResellerAuthProvider>
  )
}
