import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Upload from '@components/upload/Upload';
import dynamic from 'next/dynamic';
import { settingService } from '../../src/services';

const SunEditor = dynamic(() => import('src/components/base/custom-sun-editor'), {
  ssr: false
});

function SettingsPage() {
  const [group, setGroup] = useState('general');
  const [settings, setSettings] = useState([]);
  const [changedValues, setChangedValues] = useState<Record<string, any>>({});

  const loadSettings = async () => {
    const resp = await settingService.find({ group });
    setSettings(resp.data);
  };

  useEffect(() => {
    loadSettings();
  }, [group]);

  const setChange = (key, value) => {
    const data = {
      ...changedValues
    };
    data[key] = value;
    setChangedValues(data);
  };

  const onUpoadComplete = (key, { data }) => {
    setChange(key, data.fileUrl);
  };

  const renderUpload = (setting) => {
    if (!setting.meta?.upload) return null;

    const uploadUrl = settingService.getFileUploadUrl();
    return (
      <Upload
        url={uploadUrl}
        config={{
          multiple: false,
          accept: setting.meta.image ? 'image/*' : '*/*'
        }}
        onComplete={(data) => onUpoadComplete(setting._id, data)}
        previewImage={setting.value}
      />
    );
  };

  const renderInput = (setting) => {
    const type = setting.type || 'text';
    const val = [undefined, null].includes(changedValues[setting._id]) ? setting.value : changedValues[setting._id];
    const steps = setting.meta?.steps || 1;

    if (setting.type === 'boolean') {
      return (
        <>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="yesnoOption"
              value="yes"
              checked={val}
              onChange={(e) => {
                const b = e.target.value;
                setChange(setting._id, b === 'yes');
              }}
            />
            <label className="form-check-label">Yes</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="yesnoOption"
              value="yes"
              checked={!val}
              onChange={(e) => {
                const b = e.target.value;
                setChange(setting._id, b === 'yes');
              }}
            />
            <label className="form-check-label">No</label>
          </div>
        </>
      );
    }

    if (setting.meta?.editor) {
      return (
        <SunEditor
          onChange={(text) => setChange(setting._id, text)}
          content={val}
        />
      );
    }

    if (setting.meta?.textarea) {
      return <textarea className="form-control" defaultValue={val} onChange={(e) => setChange(setting._id, e.target.value)} rows={3} />;
    }

    return (
      <input
        type={type}
        className="form-control"
        id={setting._id}
        onChange={(e) => setChange(setting._id, e.target.value)}
        value={val}
        step={steps}
      />
    );
  };

  const renderItem = (setting) => (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label" htmlFor={setting._id}>{setting.name}</label>
      <div className="col-sm-10">
        {renderInput(setting)}
        {renderUpload(setting)}
        <small className="form-text text-muted">{setting.description}</small>
      </div>
    </div>
  );

  const onSubmit = async () => {
    await Object.keys(changedValues).reduce(async (lp, settingId) => {
      await lp;
      return settingService.update(settingId, {
        value: changedValues[settingId]
      });
    }, Promise.resolve());

    await loadSettings();
    setChangedValues({});

    toast.success('Die Einstellungen wurden aktualisiert');
  };

  return (
    <main className="main">
      <Head>
        <title>Einstellungen</title>
      </Head>
      <div className="content">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className={`nav-link ${group === 'general' ? 'active' : ''}`} href="#" onClick={() => setGroup('general')}>Allgemein</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${group === 'commission' ? 'active' : ''}`} href="#" onClick={() => setGroup('commission')}>Kommission</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${group === 'smtp' ? 'active' : ''}`} href="#" onClick={() => setGroup('smtp')}>SMTP</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${group === 'email' ? 'active' : ''}`} href="#" onClick={() => setGroup('email')}>E-Mails</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${group === 'seo' ? 'active' : ''}`} href="#" onClick={() => setGroup('seo')}>DAS</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${group === 'ccbill' ? 'active' : ''}`} href="#" onClick={() => setGroup('ccbill')}>CCBill</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${group === 'image' ? 'active' : ''}`} href="#" onClick={() => setGroup('image')}>Bild</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${group === 'customScript' ? 'active' : ''}`} href="#" onClick={() => setGroup('customScript')}>Benutzerdefiniertes Skript</a>
          </li>
        </ul>

        <div style={{ marginTop: '20px' }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          >
            {settings.map((setting) => renderItem(setting))}

            <div className="form-group row">
              <div className="col-sm-10 offset-sm-2">
                <hr />
                <button type="submit" className="btn btn-primary">Änderungen speichern</button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}

export default SettingsPage;
