import { ourFileRouter } from '$lib/Uploadthing/Uploadthing';

import { createRouteHandler } from 'uploadthing/server';
import { SECRET_UPLOADTHING_APP_ID } from '$env/static/private';

const handlers = createRouteHandler({
	router: ourFileRouter,
	config: {
		token: SECRET_UPLOADTHING_APP_ID
	}
});

export { handlers as GET, handlers as POST };
