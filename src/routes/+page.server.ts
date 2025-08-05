import { error } from '@sveltejs/kit';

export async function load({ locals }) {
  let route;
  let staff;
  let services;
  let testimonials;

  try {
    // Fetch the home page
    route = await locals.pb.collection('pages').getFirstListItem(`slug="home"`, {
      expand: 'globals'
    });

    // Fetch all staff members
    staff = await locals.pb.collection('staff').getFullList({
      sort: 'created'
    });

    services = await locals.pb.collection('services').getFullList({
      sort: 'created'
    });

    // Fetch all testimonials
    testimonials = await locals.pb.collection('testimonials').getFullList({
      sort: 'created'
    });
  } catch (err) {
    throw error(404);
  }

  return {
    route,
    staff,
    services,
    testimonials
  };
}

export const trailingSlash = 'always';
export const prerender = false;
