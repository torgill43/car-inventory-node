-- #1 Insert data into table `client`
INSERT INTO public.client(
	client_firstname,
	client_lastname,
	client_email,
	client_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
)

-- #2 Update Tony Stark client_type to 'Admin'
UPDATE public.client SET client_type = 'Admin'
WHERE client_id = 1;

-- #3 Remove Tony Stark from table `Client`
DELETE FROM public.client
WHERE client_id = 1;

-- #4 Modify GM Hummer description
UPDATE public.inventory
SET	inv_description = REPLACE (inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- #5 Query for records from inventory that match the 'Sport' classification
SELECT inv_make, inv_model, classification_name 
FROM public.inventory inv
INNER JOIN public.classification cls
	ON inv.classification_id = cls.classification_id
WHERE inv.classification_id = 2;

-- #6 Adding '/vehicles' to image and thumbnail path
UPDATE public.inventory
SET 
	inv_image =	REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail =	REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');