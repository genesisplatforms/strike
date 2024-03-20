import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Footer.scss';

// import { useLocation } from "react-router-dom";

export default function Footer({ WebSitePages, navigateTo }) {
    const Navigate = useNavigate()
    return (
        <div className="Footer">
            <div className="FooterTop">

                <div className="SiteMapDiv">
                    <h1>Support</h1>
                    <div className="SiteMapDivList">
                        {WebSitePages.filter(a=>a.Category == "Resources").map((A, index) =>
                            <a key={index} href={`${A.Path}`}>{A.Name}</a>
                        )}
                    </div>
                </div>
                <div className="SiteMapDiv">
                    <h1>Business solutions</h1>
                    <div className="SiteMapDivList">
                        {WebSitePages.filter(a=>a.Category == "Sulotion").map((A, index) =>
                            <a key={index} href={`${A.Path}`}>{A.Name}</a>
                        )}
                    </div>
                </div>
                <div className="SiteMapDiv">
                    <h1>About Us</h1>
                    <div className="SiteMapDivList">
                        {WebSitePages.filter(a=>a.Category == "About").map((A, index) =>
                            <a key={index} href={`${A.Path}`}>{A.Name}</a>
                        )}
                    </div>
                </div>
            </div>
            <div className="Footer2">
                <h1>SENEER <span>Capital</span></h1>
            </div>
            <div className="Footer3">
                <h1>Copyright © 2023 SENEER. All rights reserved.</h1>
                <p>
                    CONFIDENTIALITY NOTICE: This message (including any attachments) is intended solely for the use of Seneer Capital Services, its affiliates and the individual addressee(s). This message may contain confidential and/or private information privileged to the recipient or recipients named above. If you are not the authorized recipient(s), or the employee or agent responsible for delivering this message to the intended recipient(s), please immediately notify the sender by e-mail at the address shown above and delete this message from your system, other storage mechanism and/or shred the document and any attachments. Any unauthorized use, review or dissemination of this message in whole or in part by persons or entities other than the intended recipient is strictly prohibited. Seneer Capital Services shall not be liable for the improper or incomplete transmission of the information contained in this communication nor for any delay in its receipt or damage to your system.
                </p>
            </div>
        </div>
    )
}
