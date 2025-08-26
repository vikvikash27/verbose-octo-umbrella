import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>

      <Card>
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-4 mb-6">Business Information</h2>
        <form className="space-y-4">
          <Input label="Store Name" id="store-name" defaultValue="EasyOrganic" />
          <Input label="Contact Email" id="contact-email" type="email" defaultValue="contact@easyorganic.com" />
          <Input label="Contact Phone" id="contact-phone" type="tel" defaultValue="+91 12345 67890" />
          <div className="pt-4">
            <Button>Save Changes</Button>
          </div>
        </form>
      </Card>

       <Card>
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-4 mb-6">Security</h2>
        <form className="space-y-4">
          <Input label="Current Password" id="current-password" type="password" />
          <Input label="New Password" id="new-password" type="password" />
          <Input label="Confirm New Password" id="confirm-password" type="password" />
          <div className="pt-4">
            <Button>Update Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Settings;