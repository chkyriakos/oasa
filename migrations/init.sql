-- -----------------------------------------------------
-- Set timezone | used in orders and users tables
-- -----------------------------------------------------
SET
    timezone = 'Greece/Athens';

-- -----------------------------------------------------
-- Drop routes table
-- -----------------------------------------------------
DROP TABLE IF EXISTS routes cascade;

-- -----------------------------------------------------
-- Create routes table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS routes (
    rname VARCHAR(3) PRIMARY KEY NOT NULL,
    startpoint VARCHAR(60) NOT NULL,
    endpoint VARCHAR(60) NOT NULL,
    map VARCHAR,
    is24hr BOOLEAN NOT NULL,
    isAirportRoute BOOLEAN NOT NULL,
    isExpress BOOLEAN NOT NULL,
    stops VARCHAR []
) WITH (oids = false);

-- -----------------------------------------------------
-- drop stops table
-- -----------------------------------------------------
DROP TABLE IF EXISTS stops cascade;

-- -----------------------------------------------------
-- create stops table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS stops (
    id SERIAL PRIMARY KEY NOT NULL,
    sname VARCHAR(40) NOT NULL,
    accessibility BOOLEAN NOT NULL,
    routes VARCHAR []
) WITH (oids = false);

-- -----------------------------------------------------
-- drop orders table
-- -----------------------------------------------------
DROP TABLE IF EXISTS orders cascade;

-- -----------------------------------------------------
-- Create orders table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY NOT NULL,
    eniaio INT NULL,
    triimero INT NULL,
    ebdomadiaio INT NULL,
    create_at TIMESTAMPTZ
) WITH (oids = false);

-- -----------------------------------------------------
-- Drop users table
-- -----------------------------------------------------
DROP TABLE IF EXISTS users cascade;

-- -----------------------------------------------------
-- Create users table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY NOT NULL,
    firstName VARCHAR(30),
    lastName VARCHAR(40),
    telephone VARCHAR(10),
    afm VARCHAR(9),
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    orders INT [] -- Can have multiple orders
) WITH (oids = false);

-- -----------------------------------------------------
-- Seed routes table
-- -----------------------------------------------------
INSERT INTO
    routes (
        rname,
        startpoint,
        endpoint,
        map,
        is24hr,
        isAirportRoute,
        isExpress,
        stops
    )
VALUES
    (
        '608',
        'ΝΕΚΡΟΤΑΦΕΙΟ ΖΩΓΡΑΦΟΥ',
        'ΓΑΛΑΤΣΙ',
        'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d50307.85419397123!2d23.7200587067922!3d37.99484140815476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e3!4m5!1s0x14a197ee1d2361b3%3A0x5f8102efa34d2335!2zzp3Otc66z4HOv8-EzrHPhs61zq_OvywgWm9ncmFmb3U!3m2!1d37.972401399999995!2d23.7803185!4m5!1s0x14a1a2849e23b62d%3A0xa377ba069b113618!2zzpPOsc67zqzPhM-Dzrk!3m2!1d38.0188948!2d23.756022299999998!5e0!3m2!1sen!2sgr!4v1579112035264!5m2!1sen!2sgr',
        FALSE,
        FALSE,
        FALSE,
        '{"3, ΝΕΚΡΟΤΑΦΕΙΟ ΖΩΓΡΑΦΟΥ", "2, ΝΟΣΟΚΟΜΕΙΟ ΕΥΑΓΓΕΛΙΣΜΟΣ", "1, ΣΥΝΤΑΓΜΑ", "5, ΓΑΛΑΤΣΙ"}'
    ),
    (
        'X95',
        'ΣΥΝΤΑΓΜΑ',
        'ΚΤΙΡΙΟ ΑΝΑΧΩΡΗΣΕΩΝ',
        'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d100653.46818880957!2d23.771626119200487!3d37.967306036925436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e3!4m5!1s0x14a1bd3e5f1b9f2d%3A0xfef6c34b5629278d!2zzqPOpc6dzqTOkc6TzpzOkSwgQXRoZW5z!3m2!1d37.9745068!2d23.7352651!4m5!1s0x14a1901ad9e75c61%3A0x38b215df0aeeb3aa!2zzpTOuc61zrjOvc6uz4IgzpHOtc-Bzr_Ou865zrzOrc69zrHPgiDOkc64zrfOvc-Ozr0gKEFUSCksIEF0dGlraSBPZG9zLCBTcGF0YS1BcnRlbWlkYQ!3m2!1d37.9356467!2d23.9484156!5e0!3m2!1sen!2sgr!4v1579115778576!5m2!1sen!2sgr',
        TRUE,
        TRUE,
        TRUE,
        '{"1, ΣΥΝΤΑΓΜΑ", "2, ΝΟΣΟΚΟΜΕΙΟ ΕΥΑΓΓΕΛΙΣΜΟΣ", "7, ΚΤΙΡΙΟ ΑΝΑΧΩΡΗΣΕΩΝ"}'
    ),
    (
        '224',
        'ΚΑΙΣΑΡΙΑΝΗΣ',
        'ΤΕΡΜΑ ΕΛ. ΒΕΝΙΖΕΛΟΥ',
        'https://www.google.com/maps/embed?pb=!1m24!1m8!1m3!1d25158.213708708554!2d23.736932!3d37.9823399!3m2!1i1024!2i768!4f13.1!4m13!3e3!4m5!1s0x14a197e8695b4a57%3A0xf18691975c281e08!2sSTARTING%20POINT%20KESARIANI!3m2!1d37.9649664!2d23.776362799999998!4m5!1s0x14a1a2a5fe7fed8d%3A0xe25904bb4f881855!2zzpXOmy7Oks6Vzp3Omc6WzpXOm86fzqUsIEF0aGluYSAxMTQgNzY!3m2!1d37.9977892!2d23.757151699999998!5e0!3m2!1sen!2sgr!4v1579120722249!5m2!1sen!2sgr',
        FALSE,
        FALSE,
        FALSE,
        '{"4, ΚΑΙΣΑΡΙΑΝΗΣ", "2, ΝΟΣΟΚΟΜΕΙΟ ΕΥΑΓΓΕΛΙΣΜΟΣ", "6, ΤΕΡΜΑ ΕΛ. ΒΕΝΙΖΕΛΟΥ"}'
    );

-- -----------------------------------------------------
-- Seed stops table
-- -----------------------------------------------------
INSERT INTO
    stops (sname, accessibility, routes)
VALUES
    (
        'ΣΥΝΤΑΓΜΑ',
        TRUE,
        '{ "608, ΝΕΚΡΟΤΑΦΕΙΟ ΖΩΓΡΑΦΟΥ - ΓΑΛΑΤΣΙ", "X95, ΣΥΝΤΑΓΜΑ - ΚΤΙΡΙΟ ΑΝΑΧΩΡΗΣΕΩΝ" }'
    ),
    (
        'ΝΟΣΟΚΟΜΕΙΟ ΕΥΑΓΓΕΛΙΣΜΟΣ',
        FALSE,
        '{ "608, ΝΕΚΡΟΤΑΦΕΙΟ ΖΩΓΡΑΦΟΥ - ΓΑΛΑΤΣΙ", "X95, ΣΥΝΤΑΓΜΑ - ΚΤΙΡΙΟ ΑΝΑΧΩΡΗΣΕΩΝ", "224, ΚΑΙΣΑΡΙΑΝΗΣ - ΤΕΡΜΑ ΕΛ. ΒΕΝΙΖΕΛΟΥ" }'
    ),
    (
        'ΝΕΚΡΟΤΑΦΕΙΟ ΖΩΓΡΑΦΟΥ',
        FALSE,
        '{ "608, ΝΕΚΡΟΤΑΦΕΙΟ ΖΩΓΡΑΦΟΥ - ΓΑΛΑΤΣΙ" }'
    ),
    (
        'ΚΑΙΣΑΡΙΑΝΗΣ',
        FALSE,
        '{ "224, ΚΑΙΣΑΡΙΑΝΗΣ - ΤΕΡΜΑ ΕΛ. ΒΕΝΙΖΕΛΟΥ" }'
    ),
    (
        'ΓΑΛΑΤΣΙ',
        TRUE,
        '{ "608, ΝΕΚΡΟΤΑΦΕΙΟ ΖΩΓΡΑΦΟΥ - ΓΑΛΑΤΣΙ" }'
    ),
    (
        'ΤΕΡΜΑ ΕΛ. ΒΕΝΙΖΕΛΟΥ',
        FALSE,
        '{ "224, ΚΑΙΣΑΡΙΑΝΗΣ - ΤΕΡΜΑ ΕΛ. ΒΕΝΙΖΕΛΟΥ" }'
    ),
    (
        'ΚΤΙΡΙΟ ΑΝΑΧΩΡΗΣΕΩΝ',
        TRUE,
        '{ "X95, ΣΥΝΤΑΓΜΑ - ΚΤΙΡΙΟ ΑΝΑΧΩΡΗΣΕΩΝ" }'
    );