import extractContent from 'app/utils/ExtractContent';
import {objAccessor} from 'app/utils/Accessors';
import { APP_NAME, APP_URL, SITE_DESCRIPTION, TWITTER_HANDLE, SHARE_IMAGE, TWITTER_SHARE_IMAGE } from 'config/client_config';

function addSiteMeta(metas) {
    metas.push({title: APP_NAME});
    metas.push({property: 'og:type', content: 'website'});
    metas.push({property: 'og:site_name', content: APP_NAME});
    metas.push({property: 'og:title', content: APP_NAME});
    metas.push({property: 'og:description', content: SITE_DESCRIPTION});
    metas.push({property: 'og:image', content: SHARE_IMAGE});
    metas.push({property: 'fb:app_id', content: $STM_Config.fb_app});
    metas.push({name: 'twitter:card', content: 'summary'});
    metas.push({name: 'twitter:site', content: TWITTER_HANDLE});
    metas.push({name: 'twitter:title', content: APP_NAME});
    metas.push({name: 'twitter:description', site_desc: SITE_DESCRIPTION});
    metas.push({name: 'twitter:image', content: SHARE_IMAGE});
}

export default function extractMeta(chain_data, rp) {
    const metas = [];
    if (rp.username && rp.slug) { // post
        const post = `${rp.username}/${rp.slug}`;
        const content = chain_data.content[post];
        if (content) {
            const d = extractContent(objAccessor, content, false);
            const url = 'https://' + APP_URL + d.link;
            const title = d.title + ' — ' + APP_NAME;
            const image = d.image_link ? d.image_link : SHARE_IMAGE;
            const twimage = d.image_link ? d.image_link : TWITTER_SHARE_IMAGE;
            metas.push({title});
            metas.push({canonical: url});
            metas.push({name: 'description', content: d.desc});
            metas.push({property: 'og:type', content: 'article'});
            metas.push({property: 'og:url', content: url});
            metas.push({property: 'og:site_name', content: APP_NAME});
            metas.push({property: 'og:title', content: title});
            metas.push({property: 'og:description', content: d.desc});
            metas.push({property: 'og:image', content: image});
            metas.push({property: 'fb:app_id', content: $STM_Config.fb_app});
            metas.push({name: 'twitter:card', content: 'summary'});
            metas.push({name: 'twitter:site', content: TWITTER_HANDLE});
            metas.push({name: 'twitter:title', content: title});
            metas.push({name: 'twitter:description', content: d.desc});
            metas.push({name: 'twitter:image', content: twimage});
        } else {
            addSiteMeta(metas);
        }
    } else { // site
        addSiteMeta(metas);
    }
    return metas;
}
