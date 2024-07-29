/* eslint-disable react/no-danger */
import cookie from "js-cookie";
import getConfig from "next/config";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

function AdultConfirmModal() {
  const [show, setShow] = useState(false);

  const confirm = () => {
    cookie.set("confirmAdult", "1", { expires: 365 });
    setShow(false);
  };

  const leave = () => {
    window.location.replace("https://www.google.com/");
  };

  const { publicRuntimeConfig: config } = getConfig();
  const htmlContent = `
  <p>
    Sie stimmen auch zu, Ihre Informationen mit ${config.DOMAIN} zu teilen. Erfahren Sie mehr <br>

    ${config.DOMAIN} <br>
    Sie stimmen auch zu, Informationen mit ${config.DOMAIN} zu teilen, da die Website ohne diese Vereinbarung nicht ordnungsgemäß funktioniert. <br>

    Ein wichtiger Teil des Kameramaterials wird von ${config.DOMAIN} bereitgestellt: <br>

    Der Profilinhalt und die Fotografien <br>
    Der Spieler und seine Funktionalitäten <br>
    Der Zahlungsabwickler <br>
    ... <br>
    Daher ist jede Seite von ${config.DOMAIN} abhängig und kann nicht von (Benutzer-URL) Service getrennt werden.
</p>
<p>
    Diese Website enthält Informationen, Links, Bilder und Videos mit sexuell explizitem Material (kollektiv das "Sexuell Explizite Material"). Fahren Sie NICHT fort, wenn: (i) Sie nicht mindestens 18 Jahre alt sind oder das Alter der Volljährigkeit in jeder Gerichtsbarkeit, in der Sie das Sexuell Explizite Material anzeigen oder anzeigen können, höher ist ("Volljährigkeitsalter"), (ii) solches Material Sie beleidigt, oder (iii) das Anzeigen des Sexuell Expliziten Materials in jeder Gemeinschaft, in der Sie sich dazu entscheiden, es anzuzeigen, nicht gesetzlich ist.
</p>
<p>
    Indem Sie sich entscheiden, diese Website zu betreten, bestätigen Sie unter Eid und unter Strafandrohung gemäß Titel 28 U.S.C. § 1746 und anderen anwendbaren Gesetzen, dass alle folgenden Aussagen wahr und korrekt sind:
</p>
<ul>
    <li>Ich habe das Volljährigkeitsalter in meiner Gerichtsbarkeit erreicht;</li>
    <li>Das sexuell explizite Material, das ich betrachte, ist für meinen persönlichen Gebrauch und ich werde keine Minderjährigen dem Material aussetzen;</li>
    <li>Ich wünsche mir, sexuell explizites Material zu empfangen/betrachten;</li>
    <li>Ich glaube, dass es als Erwachsener mein unveräußerliches verfassungsmäßiges Recht ist, sexuell explizites Material zu empfangen/betrachten;</li>
    <li>Ich glaube, dass sexuelle Handlungen zwischen einvernehmlichen Erwachsenen weder beleidigend noch obszön sind;</li>
    <li>Das Betrachten, Lesen und Herunterladen von sexuell explizitem Material verstößt nicht gegen die Standards einer Gemeinschaft, Stadt, eines Staates oder Landes, in der/dem ich das Sexuell Explizite Material anzeigen, lesen und/oder herunterladen werde;</li>
    <li>Ich bin allein verantwortlich für etwaige falsche Angaben oder rechtliche Konsequenzen beim Anzeigen, Lesen oder Herunterladen von Material, das auf dieser Website erscheint. Ich stimme weiterhin zu, dass weder diese Website noch ihre Partner für rechtliche Konsequenzen verantwortlich gemacht werden können, die sich aus einem betrügerischen Zugang oder einer betrügerischen Nutzung dieser Website ergeben;</li>
    <li>Ich verstehe, dass meine Nutzung dieser Website durch die <a href="/page/terms-and-conditions">Nutzungsbedingungen</a> der Website geregelt ist, die ich überprüft und akzeptiert habe, und ich erkläre mich damit einverstanden, an solche Bedingungen gebunden zu sein.</li>
    <li>Ich erkläre mich damit einverstanden, dass ich durch den Zugriff auf diese Website mich selbst und jedes Unternehmen, an dem ich ein rechtliches oder wirtschaftliches Interesse habe, der persönlichen Gerichtsbarkeit des Staates Florida, Miami-Dade County, unterwerfe, sollte zwischen dieser Website, mir und/oder einem solchen Unternehmen jederzeit ein Streitfall entstehen;</li>
    <li>Diese Warnseite stellt eine rechtlich bindende Vereinbarung zwischen mir, dieser Website und/oder einem Unternehmen dar, an dem ich ein rechtliches oder wirtschaftliches Interesse habe. Sollte eine Bestimmung dieser Vereinbarung als nicht durchsetzbar erachtet werden, so wird der Rest so weit wie möglich durchgesetzt und die nicht durchsetzbare Bestimmung wird in dem Maße modifiziert, wie es erforderlich ist, um ihre Durchsetzung in einer Weise zu ermöglichen, die den hierin zum Ausdruck gebrachten Absichten am nächsten kommt;</li>
    <li>Alle Darsteller auf dieser Website sind über 18 Jahre alt, haben der Fotografie und/oder Filmaufnahmen zugestimmt, glauben, dass es ihr Recht ist, sich an einvernehmlichen sexuellen Handlungen zum Vergnügen und zur Bildung anderer Erwachsener zu beteiligen, und ich glaube, dass es mein Recht als Erwachsener ist, sie dabei zu beobachten, was Erwachsene tun;</li>
    <li>Die Videos und Bilder auf dieser Website sind für den verantwortungsvollen Gebrauch durch Erwachsene als sexuelle Hilfsmittel, zur sexuellen Bildung und zur sexuellen Unterhaltung gedacht;</li>
    <li>Ich verstehe, dass die Abgabe einer falschen Erklärung unter Strafandrohung eine Straftat ist; und</li>
    <li>Ich erkläre mich damit einverstanden, dass diese Vereinbarung durch das "Gesetz über elektronische Signaturen im globalen und nationalen Handel" (allgemein bekannt als "E-Sign Act"), 15 U.S.C. § 7000, et seq., geregelt wird, und indem ich mich dazu entscheide, auf "Ich stimme zu. Hier eintreten" zu klicken und meine Zustimmung zur Bindung an die Bedingungen dieser Vereinbarung anzuzeigen, übernehme ich die unten stehende Unterschriftenzeile ausdrücklich als meine Unterschrift und als Ausdruck meines Einverständnisses, durch die Bedingungen dieser Vereinbarung gebunden zu sein.</li>
</ul>

  `;

  useEffect(() => {
    const hasConfirm = cookie.get("confirmAdult");
    if (!hasConfirm) setShow(true);
  }, []);

  return (
    <Modal
      className="modal-adult"
      aria-labelledby="contained-modal-title-vcenter"
      show={show}
    >
      <Modal.Header>
        DU MUSST ÜBER 18 JAHRE ALT SEIN UND DEN UNTEN STEHENDEN BEDINGUNGEN
        ZUSTIMMEN, BEVOR DU FORTFAHREN KANNST
      </Modal.Header>
      <Modal.Body>
        <div>
          <div
            className="scroll"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <p className="notice-txt">
            DIESE WEBSITE ARBEITET AKTIV MIT DER RECHTSDURCHSETZUNG IN ALLEN
            FÄLLEN VON VERMUTETEM ILLEGALEM GEBRAUCH DES DIENSTES ZUSAMMEN,
            INSBESONDERE IM FALL VON MINDERJÄHRIGEM GEBRAUCH DES DIENSTES
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={confirm}
          className="form-control btn btn-primary"
        >
          ICH STIMME ZU
        </button>
        <button
          type="button"
          onClick={leave}
          className="form-control btn btn-default"
        >
          Ausgang
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AdultConfirmModal;
