--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.4 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA pgsodium;


ALTER SCHEMA pgsodium OWNER TO supabase_admin;

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: postgres
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: supabase_admin
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


ALTER FUNCTION vault.secrets_encrypt_secret_secret() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    category_number integer NOT NULL,
    title text NOT NULL,
    display_order integer NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: chapters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chapters (
    id integer NOT NULL,
    chapter_number integer NOT NULL,
    title text NOT NULL
);


ALTER TABLE public.chapters OWNER TO postgres;

--
-- Name: chapters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chapters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chapters_id_seq OWNER TO postgres;

--
-- Name: chapters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chapters_id_seq OWNED BY public.chapters.id;


--
-- Name: checklist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checklist_items (
    id integer NOT NULL,
    section_id integer,
    parent_item_id integer,
    display_order integer NOT NULL,
    item_text text NOT NULL,
    has_text_input boolean DEFAULT false,
    input_label text,
    input_placeholder text,
    input_unit text
);


ALTER TABLE public.checklist_items OWNER TO postgres;

--
-- Name: checklist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.checklist_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.checklist_items_id_seq OWNER TO postgres;

--
-- Name: checklist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.checklist_items_id_seq OWNED BY public.checklist_items.id;


--
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    chapter_id integer,
    category_id integer,
    title text NOT NULL,
    display_order integer NOT NULL
);


ALTER TABLE public.sections OWNER TO postgres;

--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sections_id_seq OWNER TO postgres;

--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: supabase_admin
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


ALTER VIEW vault.decrypted_secrets OWNER TO supabase_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: chapters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters ALTER COLUMN id SET DEFAULT nextval('public.chapters_id_seq'::regclass);


--
-- Name: checklist_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_items ALTER COLUMN id SET DEFAULT nextval('public.checklist_items_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, category_number, title, display_order) FROM stdin;
1	1	History	1
2	2	Alarm Features	2
3	3	Medications	3
4	4	Diet	4
5	5	Review of Systems	5
6	6	Collateral History	6
7	7	Risk Factors	7
8	8	Differential Diagnosis	8
9	9	Past Medical History	9
10	10	Physical Exam	10
11	11	Lab Studies	11
12	12	Imaging	12
13	13	Special Tests	13
14	14	ECG	14
15	15	Assessment	15
16	16	Plan	16
17	17	Disposition	17
18	18	Patient Education	18
\.


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chapters (id, chapter_number, title) FROM stdin;
1	100	Factitious Disorders and Malingering
2	101	Suicidal Behavior
3	102	Arthritis
4	103	Tendinopathy and Bursitis
5	104	Musculoskeletal Back Pain
6	105	Systemic Lupus Erythematosus and the Vasculitides
7	106	Allergy, Anaphylaxis, and Angioedema
8	107	Dermatologic Presentations
9	108	Blood and Blood Components
10	109	Anemia and Polycythemia
11	10	Cyanosis
12	110	White Blood Cell Disorders
13	111	Disorders of Hemostasis
14	112	Oncologic Emergencies
15	113	Acid-Base Disorders
16	114	Electrolyte Disorders
17	115	Diabetes Mellitus and Disorders of Glucose Homeostasis
18	116	Rhabdomyolysis
19	117	Thyroid and Adrenal Disorders
20	118	Bacteria
21	119	Viruses
22	11	Syncope
23	120	Coronaviruses
24	121	HIV
25	122	Parasites
26	123	Tickborne Illnesses
27	124	Tuberculosis
28	125	Bone and Joint Infections
29	126	Skin and Soft Tissue Infections
30	127	Sepsis Syndrome
31	128	Hypothermia, Frostbite, and Nonfreezing Cold Injuries
32	129	Heat Illness
33	12	Depressed Consciousness and Coma
34	130	Electrical and Lightning Injuries
35	131	Scuba Diving and Dysbarism
36	132	High-Altitude Medicine
37	133	Drowning
38	134	Radiation Injuries
39	135	Care of the Poisoned Patient
40	136	Toxic Alcohols
41	137	Alcohol-Related Disease
42	138	Acetaminophen
43	139	Aspirin and Nonsteroidal Agents
44	13	Confusion
45	140	Anticholinergics
46	141	Antidepressants
47	142	Cardiovascular Drugs
48	143	Caustics
49	144	Cocaine and Other Sympathomimetics
50	145	THC and Hallucinogens
51	146	Iron and Heavy Metals
52	147	Hydrocarbons
53	148	Inhaled Toxins
54	149	Lithium
55	14	Seizures
56	150	Antipsychotics
57	151	Opioids
58	152	Pesticides
59	153	Plants, Herbal Medications, and Mushrooms
60	154	Sedative-Hypnotics
61	155	Care of the Pediatric Patient
62	156	Pediatric Airway Management
63	157	Pediatric Sedation and Analgesia
64	158	Pediatric Resuscitation
65	159	Neonatal Resuscitation
66	15	Dizziness and Vertigo
67	160	Pediatric Trauma
68	161	Pediatric Fever
69	162	Pediatric Upper Airway Obstruction and Infections
70	163	Pediatric Lower Airway Obstruction
71	164	Pediatric Lung Disease
72	165	Pediatric Cardiac Disorders
73	166	Pediatric Gastrointestinal Disorders
74	167	Pediatric Infectious Diarrheal Disease and Dehydration
75	168	Pediatric Genitourinary and Renal Tract Disorders
76	169	Pediatric Neurologic Disorders
77	16	Headache
78	170	Pediatric Musculoskeletal Disorders
79	171	Pediatric Drug Therapy
80	172	Child Abuse
81	173	Complications of Pregnancy
82	174	Medical Emergencies During Pregnancy
83	175	Drug Therapy in Pregnancy
84	176	Labor and Delivery
85	177	Trauma in Pregnancy
86	178	Care of the Geriatric Patient
87	179	Geriatric Trauma
88	17	Diplopia
89	180	Geriatric Drug Therapy
90	181	Geriatric Abuse and Neglect
91	182	The Immunocompromised Patient
92	183	The Solid Organ Transplant Patient
93	184	The Morbidly Obese Patient
94	185	The Combative and Difficult Patient
95	18	Red and Painful Eye
96	19	Sore Throat
97	20	Hemoptysis
98	21	Dyspnea
99	22	Chest Pain
100	23	Abdominal Pain
101	24	Jaundice
102	25	Nausea and Vomiting
103	26	Gastrointestinal Bleeding
104	27	Diarrhea
105	28	Constipation
106	29	Acute Pelvic Pain
107	30	Vaginal Bleeding
108	31	Back Pain
109	32	Multiple Trauma
110	33	Head Trauma
111	34	Facial Trauma
112	35	Spinal Trauma
113	36	Neck Trauma
114	37	Thoracic Trauma
115	38	Abdominal Trauma
116	39	Genitourinary Trauma
117	40	Peripheral Vascular Trauma
118	41	General Principles of Orthopedic Injuries
119	42	Hand Injuries
120	43	Wrist and Forearm Injuries
121	44	Humerus and Elbow Injuries
122	45	Shoulder Injuries
123	46	Pelvic Injuries
124	47	Femur and Hip Injuries
125	48	Knee and Lower Leg Injuries
126	49	Ankle and Foot Injuries
127	50	Wound Management Principles
128	51	Foreign Bodies
129	52	Mammalian Bites
130	53	Venomous Animal Injuries
131	54	Thermal Injuries
132	55	Chemical Injuries
133	56	Oral Medicine
134	57	Ophthalmology
135	58	Otolaryngology
136	59	Asthma
137	60	Chronic Obstructive Pulmonary Disease
138	61	Upper Respiratory Tract Infections
139	62	Pneumonia
140	63	Pleural Disease
141	64	Acute Coronary Syndromes
142	65	Dysrhythmias
143	66	Implantable Cardiac Devices
144	67	Heart Failure
145	68	Pericardial and Myocardial Disease
146	69	Infective Endocarditis and Valvular Heart Disease
147	70	Hypertension
148	71	Aortic Dissection
149	72	Abdominal Aortic Aneurysm
150	73	Peripheral Arteriovascular Disease
151	74	Pulmonary Embolism and Deep Vein Thrombosis
152	75	Esophagus, Stomach, and Duodenum
153	76	Liver and Biliary Tract Disorders
154	77	Pancreas
155	78	Small Intestine
156	79	Acute Appendicitis
157	80	Gastroenteritis
158	81	Large Intestine
159	82	Anorectum
160	83	Renal Failure
161	84	Sexually Transmitted Infections
162	85	Urologic Disorders
163	86	Gynecologic Disorders
164	87	Stroke
165	88	Seizure
166	89	Headache Disorders
167	8	Fever in the Adult Patient
168	90	Delirium and Dementia
169	91	Brain and Cranial Nerve Disorders
170	92	Spinal Cord Disorders
171	93	Peripheral Nerve Disorders
172	94	Neuromuscular Disorders
173	95	Central Nervous System Infections
174	96	Thought Disorders
175	97	Mood Disorders
176	98	Anxiety Disorders
177	99	Somatic Symptoms and Related Disorders
178	9	Weakness
\.


--
-- Data for Name: checklist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checklist_items (id, section_id, parent_item_id, display_order, item_text, has_text_input, input_label, input_placeholder, input_unit) FROM stdin;
1	1	\N	1	Altered mental status (R41.82)	f	\N	\N	\N
2	1	\N	2	Seizures (R56.9)	f	\N	\N	\N
3	1	\N	3	Headache (R51)	f	\N	\N	\N
4	1	\N	4	Dizziness (R42)	f	\N	\N	\N
5	1	\N	5	Lethargy (R53.83)	f	\N	\N	\N
6	1	\N	6	Coma (R40.2)	f	\N	\N	\N
7	2	\N	1	Respiratory distress (R06.00)	f	\N	\N	\N
8	2	\N	2	Tachypnea >20/min (R06.82)	f	\N	\N	\N
9	2	\N	3	Pediatric tachypnea >60/min (R06.82)	f	\N	\N	\N
10	2	\N	4	Hypoxemia (SpO2 <92%) (R09.02)	f	\N	\N	\N
11	2	\N	5	Refractory hypoxemia (not improving with oxygen) (R09.02)	f	\N	\N	\N
12	2	\N	6	Upper airway obstruction (J39.8)	f	\N	\N	\N
13	2	\N	7	Periodic apnea episodes (R06.81)	f	\N	\N	\N
14	2	\N	8	Diaphoresis with feeding (infant) (R61)	f	\N	\N	\N
15	3	\N	1	Cyanosis (R23.0)	f	\N	\N	\N
16	3	15	1	Central (perioral, oral mucosa, conjunctivae)	f	\N	\N	\N
17	3	15	2	Peripheral (extremities, nail beds)	f	\N	\N	\N
18	3	15	3	Differential (upper/lower body or right/left)	f	\N	\N	\N
19	3	\N	2	Tachycardia (R00.0)	f	\N	\N	\N
20	3	\N	3	Bradycardia (R00.1)	f	\N	\N	\N
21	3	\N	4	Hypotension (I95.9)	f	\N	\N	\N
22	3	\N	5	Signs of shock (R57.9)	f	\N	\N	\N
23	3	\N	6	Chest pain (R07.9)	f	\N	\N	\N
24	3	\N	7	Chocolate-brown colored blood (R78.79)	f	\N	\N	\N
25	4	\N	1	Methemoglobin level <20% (asymptomatic)	f	\N	\N	\N
26	4	\N	2	Methemoglobin 20-30% (symptomatic)	f	\N	\N	\N
27	4	\N	3	Methemoglobin 30-50% (headache, fatigue, weakness, dizziness)	f	\N	\N	\N
28	4	\N	4	Methemoglobin >50% (altered mental status, seizures)	f	\N	\N	\N
29	4	\N	5	Methemoglobin >70% (life-threatening)	f	\N	\N	\N
30	5	\N	1	Cyanosis with feeding (R23.0)	f	\N	\N	\N
31	5	\N	2	Poor weight gain (R62.51)	f	\N	\N	\N
32	5	\N	3	Tetralogy of Fallot spells (Q21.3)	f	\N	\N	\N
33	5	\N	4	Congenital heart disease signs (Q24.9)	f	\N	\N	\N
34	6	\N	1	No improvement with supplemental oxygen	f	\N	\N	\N
35	6	\N	2	Elevated oxygen saturation gap	f	\N	\N	\N
36	6	\N	3	Sulfhemoglobinemia suspicion	f	\N	\N	\N
37	6	\N	4	Critical limb ischemia (I74.9)	f	\N	\N	\N
38	6	\N	5	Thrombotic/embolic events (I74.9)	f	\N	\N	\N
39	7	\N	1	Peripheral cyanosis (R23.0)	f	\N	\N	\N
40	7	39	1	Due to low cardiac output state	f	\N	\N	\N
41	7	39	2	Due to arterial occlusion/vasoconstriction	f	\N	\N	\N
42	7	39	3	Due to venous obstruction	f	\N	\N	\N
43	7	39	4	Due to environmental exposure	f	\N	\N	\N
44	7	\N	2	Central cyanosis (R23.0)	f	\N	\N	\N
45	7	44	1	Due to decreased arterial oxygen saturation	f	\N	\N	\N
46	7	44	2	Due to anatomic shunt	f	\N	\N	\N
47	7	44	3	Due to hemoglobin disorder	f	\N	\N	\N
48	7	\N	3	Methemoglobinemia (D74.0)	f	\N	\N	\N
49	7	48	1	Congenital (D74.0)	f	\N	\N	\N
50	7	49	1	Hemoglobin M disease	f	\N	\N	\N
51	7	49	2	NADH methemoglobin reductase deficiency	f	\N	\N	\N
52	7	48	2	Acquired (D74.8)	f	\N	\N	\N
53	7	52	1	Medication-induced (specify agent)	t	Medication-induced (specify agent)	Enter medication-induced (specify agent)	\N
54	7	52	2	Chemical exposure-induced (specify agent)	t	Chemical exposure-induced (specify agent)	Enter chemical exposure-induced (specify agent)	\N
55	7	52	3	Idiopathic	f	\N	\N	\N
56	7	48	3	Severity:	f	\N	\N	\N
57	7	56	1	Mild (<20% methemoglobin)	f	\N	\N	\N
58	7	56	2	Moderate (20-50% methemoglobin)	f	\N	\N	\N
59	7	56	3	Severe (>50% methemoglobin)	f	\N	\N	\N
60	7	56	4	Life-threatening (>70% methemoglobin)	f	\N	\N	\N
61	7	\N	4	Sulfhemoglobinemia (D74.8)	f	\N	\N	\N
62	7	\N	5	Cardiopulmonary disorders (specify)	t	Cardiopulmonary disorders (specify)	Enter cardiopulmonary disorders (specify)	\N
63	7	\N	6	Other diagnosis	t	Other diagnosis	Enter other diagnosis	\N
64	8	\N	1	Hypoxemia (R09.02)	f	\N	\N	\N
65	8	\N	2	Hypoxia (R09.02)	f	\N	\N	\N
66	8	\N	3	Lactic acidosis (E87.2)	f	\N	\N	\N
67	8	\N	4	Shock (R57.9)	f	\N	\N	\N
68	8	67	1	Hypovolemic (R57.1)	f	\N	\N	\N
69	8	67	2	Cardiogenic (R57.0)	f	\N	\N	\N
70	8	67	3	Septic (R65.21)	f	\N	\N	\N
71	8	67	4	Other (specify)	t	Other (specify)	Enter other (specify)	\N
72	8	\N	5	Respiratory failure (J96.90)	f	\N	\N	\N
73	8	72	1	Acute (J96.00)	f	\N	\N	\N
74	8	72	2	Chronic (J96.10)	f	\N	\N	\N
75	8	72	3	Acute on chronic (J96.20)	f	\N	\N	\N
76	8	\N	6	Congenital heart disease (Q24.9)	f	\N	\N	\N
77	8	76	1	Type (specify)	t	Type (specify)	Enter type (specify)	\N
78	8	\N	7	Pulmonary embolism (I26.99)	f	\N	\N	\N
79	8	\N	8	Pneumonia (J18.9)	f	\N	\N	\N
80	8	\N	9	Congestive heart failure (I50.9)	f	\N	\N	\N
81	8	\N	10	Raynaud phenomenon (I73.00)	f	\N	\N	\N
82	8	\N	11	Peripheral vascular disease (I73.9)	f	\N	\N	\N
83	8	\N	12	Airway obstruction (J98.8)	f	\N	\N	\N
84	8	\N	13	Pneumothorax (J93.9)	f	\N	\N	\N
85	8	\N	14	Pulmonary hypertension (I27.0)	f	\N	\N	\N
86	8	\N	15	Anemia (D64.9)	f	\N	\N	\N
87	8	\N	16	Polycythemia (D75.1)	f	\N	\N	\N
88	8	\N	17	Sepsis (A41.9)	f	\N	\N	\N
89	8	\N	18	G6PD deficiency (D55.0)	f	\N	\N	\N
90	8	\N	19	Other (specify)	t	Other (specify)	Enter other (specify)	\N
91	9	\N	1	Stable	f	\N	\N	\N
92	9	\N	2	Stable with supplemental oxygen	f	\N	\N	\N
93	9	\N	3	Unstable	f	\N	\N	\N
94	9	\N	4	Critical	f	\N	\N	\N
95	10	\N	1	Good response to oxygen therapy	f	\N	\N	\N
480	46	\N	6	Low birth weight	f	\N	\N	\N
96	10	\N	2	Minimal/no response to oxygen therapy	f	\N	\N	\N
97	10	\N	3	Improved with fluid resuscitation	f	\N	\N	\N
98	10	\N	4	Improved with methylene blue (for methemoglobinemia)	f	\N	\N	\N
99	10	\N	5	No improvement with methylene blue (consider sulfhemoglobinemia)	f	\N	\N	\N
100	10	\N	6	Improved with other interventions (specify)	t	Improved with other interventions (specify)	Enter improved with other interventions (specify)	\N
101	10	\N	7	No improvement with interventions	f	\N	\N	\N
102	11	\N	1	Mild	f	\N	\N	\N
103	11	\N	2	Moderate	f	\N	\N	\N
104	11	\N	3	Severe	f	\N	\N	\N
105	11	\N	4	Life-threatening	f	\N	\N	\N
106	12	\N	1	Environmental exposure (specify)	t	Environmental exposure (specify)	Enter environmental exposure (specify)	\N
107	12	\N	2	Medication-related (specify)	t	Medication-related (specify)	Enter medication-related (specify)	\N
108	12	\N	3	Genetic/congenital (specify)	t	Genetic/congenital (specify)	Enter genetic/congenital (specify)	\N
109	12	\N	4	Cardiopulmonary disease (specify)	t	Cardiopulmonary disease (specify)	Enter cardiopulmonary disease (specify)	\N
110	12	\N	5	Infection (specify)	t	Infection (specify)	Enter infection (specify)	\N
111	12	\N	6	Vascular disorder (specify)	t	Vascular disorder (specify)	Enter vascular disorder (specify)	\N
112	12	\N	7	Multifactorial	f	\N	\N	\N
113	12	\N	8	Unknown	f	\N	\N	\N
114	13	\N	1	Straightforward	f	\N	\N	\N
115	13	\N	2	Low complexity	f	\N	\N	\N
116	13	\N	3	Moderate complexity	f	\N	\N	\N
117	13	\N	4	High complexity	f	\N	\N	\N
118	14	\N	1	Low risk	f	\N	\N	\N
119	14	\N	2	Moderate risk	f	\N	\N	\N
120	14	\N	3	High risk	f	\N	\N	\N
121	14	\N	4	Very high risk	f	\N	\N	\N
122	15	\N	1	Favorable prognostic indicators (specify)	t	Favorable prognostic indicators (specify)	Enter favorable prognostic indicators (specify)	\N
123	15	\N	2	Unfavorable prognostic indicators (specify)	t	Unfavorable prognostic indicators (specify)	Enter unfavorable prognostic indicators (specify)	\N
124	16	\N	1	Patient	f	\N	\N	\N
125	16	\N	2	Family member (relation	t	Family member (relation	Enter family member (relation	\N
126	16	\N	3	Caregiver	f	\N	\N	\N
127	16	\N	4	Friend	f	\N	\N	\N
128	16	\N	5	Healthcare provider	f	\N	\N	\N
129	16	\N	6	Previous medical records	f	\N	\N	\N
130	16	\N	7	EMS personnel	f	\N	\N	\N
131	16	\N	8	Other	t	Other	Enter other	\N
132	17	\N	1	Reliable	f	\N	\N	\N
133	17	\N	2	Somewhat reliable	f	\N	\N	\N
134	17	\N	3	Unreliable	f	\N	\N	\N
135	17	\N	4	Unable to assess	f	\N	\N	\N
136	18	\N	1	Witnessed onset of symptoms	f	\N	\N	\N
137	18	\N	2	Unwitnessed onset of symptoms	f	\N	\N	\N
138	18	\N	3	Found with symptoms	f	\N	\N	\N
139	18	\N	4	Duration observed by collateral source	t	Duration observed by collateral source	Enter duration observed by collateral source	\N
140	18	\N	5	Temporal pattern observed	f	\N	\N	\N
141	19	\N	1	Observed color changes (cyanosis)	f	\N	\N	\N
142	19	141	1	Central (lips, tongue, mucosa)	f	\N	\N	\N
143	19	141	2	Peripheral (extremities, nail beds)	f	\N	\N	\N
144	19	141	3	Differential (upper/lower body)	f	\N	\N	\N
145	19	\N	2	Observed respiratory changes	f	\N	\N	\N
146	19	145	1	Tachypnea	f	\N	\N	\N
147	19	145	2	Respiratory distress	f	\N	\N	\N
148	19	145	3	Apnea episodes	f	\N	\N	\N
149	19	\N	3	Observed mental status changes	f	\N	\N	\N
150	19	149	1	Confusion	f	\N	\N	\N
151	19	149	2	Lethargy	f	\N	\N	\N
152	19	149	3	Unresponsiveness	f	\N	\N	\N
153	19	149	4	Seizure activity	f	\N	\N	\N
154	19	\N	4	Observed cardiopulmonary symptoms	f	\N	\N	\N
155	19	154	1	Chest pain	f	\N	\N	\N
156	19	154	2	Palpitations	f	\N	\N	\N
157	19	154	3	Syncope	f	\N	\N	\N
158	19	154	4	Presyncope	f	\N	\N	\N
159	20	\N	1	Feeding difficulties	f	\N	\N	\N
160	20	\N	2	Sweating with feeding	f	\N	\N	\N
161	20	\N	3	Cyanosis with feeding or crying	f	\N	\N	\N
162	20	\N	4	Poor weight gain	f	\N	\N	\N
163	20	\N	5	"Tet spells" observed	f	\N	\N	\N
164	20	\N	6	Developmental concerns	f	\N	\N	\N
165	20	\N	7	Birth history (if relevant)	f	\N	\N	\N
166	21	\N	1	Exposure to medications	f	\N	\N	\N
167	21	\N	2	Exposure to chemicals	f	\N	\N	\N
168	21	\N	3	Well water consumption	f	\N	\N	\N
169	21	\N	4	High altitude exposure	f	\N	\N	\N
170	21	\N	5	Cold exposure	f	\N	\N	\N
171	21	\N	6	Occupational exposures	f	\N	\N	\N
172	21	\N	7	Household exposures	f	\N	\N	\N
173	22	\N	1	Family history of similar symptoms	f	\N	\N	\N
174	22	\N	2	Family history of congenital heart disease	f	\N	\N	\N
175	22	\N	3	Family history of hematologic disorders	f	\N	\N	\N
176	22	\N	4	Family history of methemoglobinemia	f	\N	\N	\N
177	22	\N	5	Family history of NADH reductase deficiency	f	\N	\N	\N
178	22	\N	6	Family history of G6PD deficiency	f	\N	\N	\N
179	22	\N	7	Family history of hereditary methemoglobinemia	f	\N	\N	\N
180	23	\N	1	Normal baseline	f	\N	\N	\N
181	23	\N	2	Chronic cyanosis at baseline	f	\N	\N	\N
182	23	\N	3	Chronic cardiopulmonary disease at baseline	f	\N	\N	\N
183	23	\N	4	Previous similar episodes	f	\N	\N	\N
184	23	\N	5	Previous workup for similar symptoms	f	\N	\N	\N
185	23	\N	6	Previous treatments for similar symptoms	f	\N	\N	\N
186	23	\N	7	Baseline functional status	f	\N	\N	\N
187	24	\N	1	Shock (R57.9)	f	\N	\N	\N
188	24	187	1	Hypovolemic shock (R57.1)	f	\N	\N	\N
189	24	187	2	Cardiogenic shock (R57.0)	f	\N	\N	\N
481	46	\N	7	Prematurity	f	\N	\N	\N
190	24	187	3	Septic shock (R65.21)	f	\N	\N	\N
191	24	187	4	Neurogenic shock (R57.8)	f	\N	\N	\N
192	24	\N	2	Left ventricular failure (I50.1)	f	\N	\N	\N
193	24	\N	3	Hypovolemia (E86.9)	f	\N	\N	\N
194	24	\N	4	Environmental cold exposure (T69.9)	f	\N	\N	\N
195	24	\N	5	Arterial occlusion (I74.9)	f	\N	\N	\N
196	24	195	1	Thrombosis (I74.9)	f	\N	\N	\N
197	24	195	2	Embolism (I74.9)	f	\N	\N	\N
198	24	195	3	Vasospasm (I73.9)	f	\N	\N	\N
199	24	\N	6	Raynaud phenomenon (I73.00)	f	\N	\N	\N
200	24	\N	7	Peripheral vascular disease (I73.9)	f	\N	\N	\N
201	24	\N	8	Venous obstruction (I87.1)	f	\N	\N	\N
202	24	\N	9	Peripheral arteriovenous fistulae (I77.0)	f	\N	\N	\N
203	25	\N	1	High altitude exposure (>8000 ft) (T70.29)	f	\N	\N	\N
204	25	\N	2	Impaired pulmonary function	f	\N	\N	\N
205	25	204	1	Hypoventilation (R06.89)	f	\N	\N	\N
206	25	205	1	Drug toxicity (T50.9)	f	\N	\N	\N
207	25	205	2	Respiratory muscle weakness (M62.81)	f	\N	\N	\N
208	25	205	3	Upper airway compromise (J39.8)	f	\N	\N	\N
209	25	204	2	Impaired oxygen diffusion	f	\N	\N	\N
210	25	209	1	Interstitial pulmonary fibrosis (J84.10)	f	\N	\N	\N
211	25	209	2	Emphysema (J43.9)	f	\N	\N	\N
212	25	204	3	Ventilation-perfusion mismatch	f	\N	\N	\N
213	25	212	1	Pulmonary embolism (I26.99)	f	\N	\N	\N
214	25	212	2	Pulmonary hypertension (I27.0)	f	\N	\N	\N
215	25	204	4	Right-to-left shunt	f	\N	\N	\N
216	25	215	1	Pneumonia (J18.9)	f	\N	\N	\N
217	25	215	2	Large pneumothorax (J93.9)	f	\N	\N	\N
218	25	215	3	Acute respiratory distress syndrome (J80)	f	\N	\N	\N
219	25	\N	3	Pulmonary arteriovenous fistulae (I28.0)	f	\N	\N	\N
220	25	\N	4	Intrapulmonary shunts (I28.8)	f	\N	\N	\N
221	25	\N	5	Cyanotic congenital heart disease	f	\N	\N	\N
222	25	221	1	Endocardial cushion defects (Q21.2)	f	\N	\N	\N
223	25	221	2	Ventricular septal defects (Q21.0)	f	\N	\N	\N
224	25	221	3	Coarctation of aorta (Q25.1)	f	\N	\N	\N
225	25	221	4	Tetralogy of Fallot (Q21.3)	f	\N	\N	\N
226	25	221	5	Total anomalous pulmonary venous return (Q26.2)	f	\N	\N	\N
227	25	221	6	Hypoplastic left ventricle (Q23.4)	f	\N	\N	\N
228	25	221	7	Pulmonary vein stenosis (Q26.8)	f	\N	\N	\N
229	25	221	8	Tricuspid atresia (Q22.4)	f	\N	\N	\N
230	25	221	9	Premature closure of foramen ovale (Q21.8)	f	\N	\N	\N
231	25	221	10	Dextrocardia (Q24.0)	f	\N	\N	\N
232	25	\N	6	Methemoglobinemia (D74.0)	f	\N	\N	\N
233	25	232	1	Congenital (hereditary) (D74.0)	f	\N	\N	\N
234	25	233	1	Hemoglobin M disease (D74.0)	f	\N	\N	\N
235	25	233	2	NADH methemoglobin reductase deficiency (D74.0)	f	\N	\N	\N
236	25	232	2	Acquired (D74.8)	f	\N	\N	\N
237	25	236	1	Medication-induced (T50.9)	f	\N	\N	\N
238	25	236	2	Chemical-induced (T65.9)	f	\N	\N	\N
239	25	\N	7	Sulfhemoglobinemia (D74.8)	f	\N	\N	\N
240	25	\N	8	Polycythemia (D75.1)	f	\N	\N	\N
241	25	240	1	Polycythemia vera (D45)	f	\N	\N	\N
242	25	240	2	Secondary polycythemia (D75.1)	f	\N	\N	\N
243	25	240	3	Relative polycythemia (D75.1)	f	\N	\N	\N
244	26	\N	1	Pseudocyanosis	f	\N	\N	\N
245	26	244	1	Dyeing agents exposure (Z77.098)	f	\N	\N	\N
246	26	244	2	Heavy metal exposure (Z77.010)	f	\N	\N	\N
247	26	244	3	Topically absorbed pigments (Z77.098)	f	\N	\N	\N
248	26	\N	2	Ischemic conditions	f	\N	\N	\N
249	26	248	1	Myocardial infarction (I21.9)	f	\N	\N	\N
250	26	248	2	Limb ischemia (I73.9)	f	\N	\N	\N
251	26	248	3	Mesenteric ischemia (K55.9)	f	\N	\N	\N
252	26	\N	3	Hypotension with poor perfusion (I95.9)	f	\N	\N	\N
253	26	\N	4	Carbon monoxide poisoning (T58.9)	f	\N	\N	\N
254	26	\N	5	Cyanide toxicity (T65.0)	f	\N	\N	\N
255	27	\N	1	Discharge home	f	\N	\N	\N
256	27	\N	2	Admit to hospital	f	\N	\N	\N
257	27	256	1	Regular floor/ward	f	\N	\N	\N
258	27	256	2	Telemetry/step-down unit	f	\N	\N	\N
259	27	256	3	Intensive care unit	f	\N	\N	\N
260	27	\N	3	Transfer to another facility	f	\N	\N	\N
261	27	260	1	Higher level of care	f	\N	\N	\N
262	27	260	2	Specialized care	f	\N	\N	\N
263	27	260	3	Pediatric facility	f	\N	\N	\N
264	27	260	4	Burn center	f	\N	\N	\N
265	27	260	5	Other (specify)	t	Other (specify)	Enter other (specify)	\N
266	27	\N	4	Observation unit	f	\N	\N	\N
267	27	\N	5	Against medical advice (document discussion)	f	\N	\N	\N
268	28	\N	1	First episode of cyanosis	f	\N	\N	\N
269	28	\N	2	Cyanosis of uncertain cause	f	\N	\N	\N
270	28	\N	3	Methemoglobinemia	f	\N	\N	\N
271	28	270	1	Symptomatic methemoglobinemia	f	\N	\N	\N
272	28	270	2	Methemoglobin level >15%	f	\N	\N	\N
273	28	270	3	Received methylene blue treatment	f	\N	\N	\N
274	28	\N	4	Sulfhemoglobinemia	f	\N	\N	\N
275	28	\N	5	Newly diagnosed congenital heart disease	f	\N	\N	\N
276	28	\N	6	Unstable vital signs	f	\N	\N	\N
277	28	\N	7	Respiratory distress/failure	f	\N	\N	\N
278	28	\N	8	Hemodynamic instability	f	\N	\N	\N
279	28	\N	9	Significant comorbidities	f	\N	\N	\N
280	28	\N	10	Need for continued monitoring	f	\N	\N	\N
281	28	\N	11	Need for supplemental oxygen	f	\N	\N	\N
282	28	\N	12	Other (specify)	t	Other (specify)	Enter other (specify)	\N
283	29	\N	1	Peripheral cyanosis from vasospasm with improvement	f	\N	\N	\N
284	29	\N	2	Asymptomatic methemoglobinemia <15% with removal of offending agent	f	\N	\N	\N
285	29	\N	3	Stable primary pulmonary disease	f	\N	\N	\N
482	46	\N	8	Dehydration	f	\N	\N	\N
286	29	\N	4	Stable vital signs for >4-6 hours	f	\N	\N	\N
287	29	\N	5	Room air oxygen saturation >92% (or at baseline)	f	\N	\N	\N
288	29	\N	6	Adequate pain control	f	\N	\N	\N
289	29	\N	7	Able to tolerate oral intake	f	\N	\N	\N
290	29	\N	8	Appropriate follow-up arranged	f	\N	\N	\N
291	29	\N	9	Patient education completed	f	\N	\N	\N
292	29	\N	10	Medications reconciled and prescriptions provided	f	\N	\N	\N
293	29	\N	11	Other (specify)	t	Other (specify)	Enter other (specify)	\N
294	30	\N	1	Primary care provider within _____ days	f	\N	\N	\N
295	30	\N	2	Cardiology within _____ days/weeks	f	\N	\N	\N
296	30	\N	3	Pulmonology within _____ days/weeks	f	\N	\N	\N
297	30	\N	4	Hematology within _____ days/weeks	f	\N	\N	\N
298	30	\N	5	Other specialist (specify)	t	Other specialist (specify)	Enter other specialist (specify)	\N
299	30	\N	6	Return to emergency department if:	f	\N	\N	\N
300	30	299	1	Worsening cyanosis	f	\N	\N	\N
301	30	299	2	Worsening dyspnea	f	\N	\N	\N
302	30	299	3	Altered mental status	f	\N	\N	\N
303	30	299	4	Chest pain	f	\N	\N	\N
304	30	299	5	Other (specify)	t	Other (specify)	Enter other (specify)	\N
305	31	\N	1	None	f	\N	\N	\N
306	31	\N	2	Home oxygen therapy	f	\N	\N	\N
307	31	306	1	Flow rate	t	Flow rate	Enter flow rate	\N
308	31	306	2	Continuous	f	\N	\N	\N
309	31	306	3	As needed	f	\N	\N	\N
310	31	306	4	With activity	f	\N	\N	\N
311	31	306	5	During sleep	f	\N	\N	\N
312	31	\N	3	Home nursing visits	f	\N	\N	\N
313	31	\N	4	Physical therapy	f	\N	\N	\N
314	31	\N	5	Occupational therapy	f	\N	\N	\N
315	31	\N	6	Speech therapy	f	\N	\N	\N
316	31	\N	7	Respiratory therapy	f	\N	\N	\N
317	31	\N	8	Durable medical equipment (specify)	t	Durable medical equipment (specify)	Enter durable medical equipment (specify)	\N
318	31	\N	9	Other (specify)	t	Other (specify)	Enter other (specify)	\N
319	32	\N	1	New prescriptions provided	f	\N	\N	\N
320	32	\N	2	Medication reconciliation completed	f	\N	\N	\N
321	32	\N	3	Specific instructions for medication changes	f	\N	\N	\N
322	32	\N	4	Instructions to avoid specific medications or chemicals	t	Instructions to avoid specific medications or chemicals	Enter instructions to avoid specific medications or chemicals	\N
323	33	\N	1	Social work consult	f	\N	\N	\N
324	33	\N	2	Case management consult	f	\N	\N	\N
325	33	\N	3	Financial counseling	f	\N	\N	\N
326	33	\N	4	Transportation arrangement	f	\N	\N	\N
327	33	\N	5	Interpreter services	f	\N	\N	\N
328	33	\N	6	Palliative care consult	f	\N	\N	\N
329	33	\N	7	Other (specify)	t	Other (specify)	Enter other (specify)	\N
330	34	\N	1	Discharge summary	f	\N	\N	\N
331	34	\N	2	Transfer summary	f	\N	\N	\N
332	34	\N	3	Specialty-specific documentation	f	\N	\N	\N
333	34	\N	4	Notification of primary care provider	f	\N	\N	\N
334	34	\N	5	Other (specify)	t	Other (specify)	Enter other (specify)	\N
335	35	\N	1	Rate	t	Rate	Enter rate	\N
336	35	\N	2	Rhythm	f	\N	\N	\N
337	35	336	1	Regular	f	\N	\N	\N
338	35	336	2	Irregular	f	\N	\N	\N
339	35	336	3	Regularly irregular	f	\N	\N	\N
340	35	336	4	Irregularly irregular	f	\N	\N	\N
341	35	\N	3	Intervals	f	\N	\N	\N
342	35	341	1	PR interval	t	PR interval	Enter pr interval	\N
343	35	341	2	QRS duration	t	QRS duration	Enter qrs duration	\N
344	35	341	3	QT interval	t	QT interval	Enter qt interval	\N
345	35	341	4	QTc interval	t	QTc interval	Enter qtc interval	\N
346	35	\N	4	Axis	f	\N	\N	\N
347	35	346	1	Normal axis	f	\N	\N	\N
348	35	346	2	Left axis deviation	f	\N	\N	\N
349	35	346	3	Right axis deviation	f	\N	\N	\N
350	35	346	4	Extreme right axis deviation (northwest axis)	f	\N	\N	\N
351	36	\N	1	Normal sinus rhythm (I49.8)	f	\N	\N	\N
352	36	\N	2	Sinus bradycardia (R00.1)	f	\N	\N	\N
353	36	\N	3	Sinus tachycardia (R00.0)	f	\N	\N	\N
354	36	\N	4	Sinus arrhythmia (R00.8)	f	\N	\N	\N
355	36	\N	5	Sinus pause/arrest (I49.5)	f	\N	\N	\N
356	36	\N	6	Atrial premature complexes (I49.1)	f	\N	\N	\N
357	36	\N	7	Ventricular premature complexes (I49.3)	f	\N	\N	\N
358	36	\N	8	Supraventricular tachycardia (I47.1)	f	\N	\N	\N
359	36	\N	9	Atrial fibrillation (I48.91)	f	\N	\N	\N
360	36	\N	10	Atrial flutter (I48.92)	f	\N	\N	\N
361	36	\N	11	Junctional rhythm (I49.8)	f	\N	\N	\N
362	36	\N	12	Ventricular tachycardia (I47.2)	f	\N	\N	\N
363	36	\N	13	Ventricular fibrillation (I49.01)	f	\N	\N	\N
364	36	\N	14	Asystole (I46.9)	f	\N	\N	\N
365	36	\N	15	Pulseless electrical activity (I46.9)	f	\N	\N	\N
366	36	\N	16	First-degree AV block (I44.0)	f	\N	\N	\N
367	36	\N	17	Second-degree AV block, Mobitz I (Wenckebach) (I44.1)	f	\N	\N	\N
368	36	\N	18	Second-degree AV block, Mobitz II (I44.1)	f	\N	\N	\N
369	36	\N	19	Third-degree (complete) AV block (I44.2)	f	\N	\N	\N
370	36	\N	20	Bundle branch block	f	\N	\N	\N
371	36	370	1	Right bundle branch block (I45.0)	f	\N	\N	\N
372	36	370	2	Left bundle branch block (I44.7)	f	\N	\N	\N
373	36	370	3	Incomplete right bundle branch block (I45.0)	f	\N	\N	\N
374	36	370	4	Incomplete left bundle branch block (I44.7)	f	\N	\N	\N
375	36	370	5	Left anterior fascicular block (I44.60)	f	\N	\N	\N
376	36	370	6	Left posterior fascicular block (I44.7)	f	\N	\N	\N
377	36	\N	21	Paced rhythm (Z95.0)	f	\N	\N	\N
378	36	377	1	Atrial pacing	f	\N	\N	\N
379	36	377	2	Ventricular pacing	f	\N	\N	\N
380	36	377	3	Dual chamber pacing	f	\N	\N	\N
381	36	377	4	Biventricular pacing	f	\N	\N	\N
382	37	\N	1	ST segment elevation (specify leads)	t	ST segment elevation (specify leads)	Enter st segment elevation (specify leads)	\N
383	37	\N	2	ST segment depression (specify leads)	t	ST segment depression (specify leads)	Enter st segment depression (specify leads)	\N
384	37	\N	3	T wave inversion (specify leads)	t	T wave inversion (specify leads)	Enter t wave inversion (specify leads)	\N
385	37	\N	4	Hyperacute T waves (specify leads)	t	Hyperacute T waves (specify leads)	Enter hyperacute t waves (specify leads)	\N
386	37	\N	5	New Q waves (specify leads)	t	New Q waves (specify leads)	Enter new q waves (specify leads)	\N
387	37	\N	6	Poor R wave progression	f	\N	\N	\N
388	37	\N	7	Pathologic Q waves (specify leads)	t	Pathologic Q waves (specify leads)	Enter pathologic q waves (specify leads)	\N
389	38	\N	1	Right atrial enlargement (P pulmonale)	f	\N	\N	\N
390	38	\N	2	Left atrial enlargement (P mitrale)	f	\N	\N	\N
391	38	\N	3	Right ventricular hypertrophy (I27.9)	f	\N	\N	\N
392	38	391	1	Right axis deviation	f	\N	\N	\N
393	38	391	2	Dominant R wave in V1	f	\N	\N	\N
394	38	391	3	Right ventricular strain pattern	f	\N	\N	\N
395	38	\N	4	Left ventricular hypertrophy (I51.7)	f	\N	\N	\N
396	38	395	1	Sokolow-Lyon criteria	f	\N	\N	\N
397	38	395	2	Cornell criteria	f	\N	\N	\N
398	38	395	3	Strain pattern	f	\N	\N	\N
399	38	\N	5	Biventricular hypertrophy	f	\N	\N	\N
400	39	\N	1	Low voltage QRS (R93.1)	f	\N	\N	\N
401	39	\N	2	Prolonged QT interval (R94.31)	f	\N	\N	\N
402	39	\N	3	Shortened QT interval (R94.31)	f	\N	\N	\N
403	39	\N	4	Brugada pattern (I49.8)	f	\N	\N	\N
404	39	\N	5	Early repolarization (R94.31)	f	\N	\N	\N
405	39	\N	6	Osborn waves (J waves)	f	\N	\N	\N
406	39	\N	7	Electrical alternans	f	\N	\N	\N
407	39	\N	8	Epsilon waves	f	\N	\N	\N
408	39	\N	9	Delta waves (pre-excitation)	f	\N	\N	\N
409	39	\N	10	U waves	f	\N	\N	\N
410	39	\N	11	J point elevation	f	\N	\N	\N
411	39	\N	12	Pseudoinfarct pattern	f	\N	\N	\N
412	40	\N	1	Hyperkalemia changes	f	\N	\N	\N
413	40	\N	2	Hypokalemia changes	f	\N	\N	\N
414	40	\N	3	Hypercalcemia changes	f	\N	\N	\N
415	40	\N	4	Hypocalcemia changes	f	\N	\N	\N
416	40	\N	5	Digoxin effect	f	\N	\N	\N
417	41	\N	1	Right heart strain pattern (cor pulmonale)	f	\N	\N	\N
418	41	\N	2	S1Q3T3 pattern (suggestive of pulmonary embolism)	f	\N	\N	\N
419	41	\N	3	Right ventricular strain	f	\N	\N	\N
420	41	\N	4	Rightward axis	f	\N	\N	\N
421	42	\N	1	No previous ECG available for comparison	f	\N	\N	\N
422	42	\N	2	No significant change from previous ECG	f	\N	\N	\N
423	42	\N	3	New changes compared to previous ECG (specify)	t	New changes compared to previous ECG (specify)	Enter new changes compared to previous ecg (specify)	\N
424	43	\N	1	Dyspnea (R06.00)	f	\N	\N	\N
425	43	\N	2	Fatigue (R53.83)	f	\N	\N	\N
426	43	\N	3	Chest discomfort (R07.89)	f	\N	\N	\N
427	43	\N	4	Decreased exercise tolerance (R53.1)	f	\N	\N	\N
428	43	\N	5	Cyanosis (R23.0)	f	\N	\N	\N
429	43	\N	6	Lethargy (R53.83)	f	\N	\N	\N
430	43	\N	7	Weakness (R53.1)	f	\N	\N	\N
431	44	\N	1	Sudden	f	\N	\N	\N
432	44	\N	2	Gradual	f	\N	\N	\N
433	44	\N	3	First episode	f	\N	\N	\N
434	44	\N	4	Recurrent	f	\N	\N	\N
435	44	\N	5	Minutes	f	\N	\N	\N
436	44	\N	6	Hours	f	\N	\N	\N
437	44	\N	7	Days	f	\N	\N	\N
438	44	\N	8	Weeks	f	\N	\N	\N
439	44	\N	9	Months	f	\N	\N	\N
440	44	\N	10	Years	f	\N	\N	\N
441	44	\N	11	Constant	f	\N	\N	\N
442	44	\N	12	Intermittent	f	\N	\N	\N
443	44	\N	13	Progressive	f	\N	\N	\N
444	44	\N	14	Episodic	f	\N	\N	\N
445	44	\N	15	Worse in morning	f	\N	\N	\N
446	44	\N	16	Worse in evening	f	\N	\N	\N
447	44	\N	17	Associated with activity	f	\N	\N	\N
448	44	\N	18	Associated with rest	f	\N	\N	\N
449	44	\N	19	Rest	f	\N	\N	\N
450	44	\N	20	Positional changes	f	\N	\N	\N
451	44	\N	21	Medication	f	\N	\N	\N
452	44	\N	22	Oxygen	f	\N	\N	\N
453	44	\N	23	None	f	\N	\N	\N
454	44	\N	24	Exercise/activity	f	\N	\N	\N
455	44	\N	25	Exposure to cold air	f	\N	\N	\N
456	44	\N	26	Exposure to cold water	f	\N	\N	\N
457	44	\N	27	High altitude	f	\N	\N	\N
458	44	\N	28	Lying flat	f	\N	\N	\N
459	44	\N	29	Stress	f	\N	\N	\N
460	45	\N	1	Medications (specify)	t	Medications (specify)	Enter medications (specify)	\N
461	45	\N	2	Local anesthetics (benzocaine, lidocaine, prilocaine)	f	\N	\N	\N
462	45	\N	3	Phenazopyridine (Pyridium)	f	\N	\N	\N
463	45	\N	4	Nitroglycerin	f	\N	\N	\N
464	45	\N	5	Metoclopramide	f	\N	\N	\N
465	45	\N	6	Sulfonamides	f	\N	\N	\N
466	45	\N	7	Dapsone	f	\N	\N	\N
467	45	\N	8	Rasburicase	f	\N	\N	\N
468	45	\N	9	Antineoplastics (cyclophosphamide, ifosfamide, flutamide)	f	\N	\N	\N
469	45	\N	10	Chemical agents (specify)	t	Chemical agents (specify)	Enter chemical agents (specify)	\N
470	45	\N	11	Aniline dye derivatives (shoe dyes, marking inks)	f	\N	\N	\N
471	45	\N	12	Naphthalene (mothballs)	f	\N	\N	\N
472	45	\N	13	Nitrates in well water	f	\N	\N	\N
473	45	\N	14	Occupational exposures (specify)	t	Occupational exposures (specify)	Enter occupational exposures (specify)	\N
474	45	\N	15	Recent travel	f	\N	\N	\N
475	46	\N	1	Difficulty feeding	f	\N	\N	\N
476	46	\N	2	Sweating	f	\N	\N	\N
477	46	\N	3	Poor weight gain	f	\N	\N	\N
478	46	\N	4	Respiratory distress	f	\N	\N	\N
479	46	\N	5	Episodic cyanotic events ("tet spells")	f	\N	\N	\N
483	46	\N	9	Acidosis	f	\N	\N	\N
484	46	\N	10	Diarrhea	f	\N	\N	\N
485	46	\N	11	Current pregnancy (trimester	t	Current pregnancy (trimester	Enter current pregnancy (trimester	\N
486	46	\N	12	Complications	t	Complications	Enter complications	\N
487	47	\N	1	PA and lateral views	f	\N	\N	\N
488	47	\N	2	Portable AP view	f	\N	\N	\N
489	47	\N	3	Findings	f	\N	\N	\N
490	47	489	1	Normal	f	\N	\N	\N
491	47	489	2	Cardiac silhouette	f	\N	\N	\N
492	47	491	1	Normal size	f	\N	\N	\N
493	47	491	2	Enlarged (cardiomegaly)	f	\N	\N	\N
494	47	491	3	Abnormal shape (suggestive of congenital heart disease)	f	\N	\N	\N
495	47	489	3	Pulmonary vascularity	f	\N	\N	\N
496	47	495	1	Normal	f	\N	\N	\N
497	47	495	2	Increased	f	\N	\N	\N
498	47	495	3	Decreased	f	\N	\N	\N
499	47	489	4	Lung fields	f	\N	\N	\N
500	47	499	1	Clear	f	\N	\N	\N
501	47	499	2	Infiltrates	f	\N	\N	\N
502	47	499	3	Consolidation	f	\N	\N	\N
503	47	499	4	Atelectasis	f	\N	\N	\N
504	47	499	5	Masses	f	\N	\N	\N
505	47	499	6	Nodules	f	\N	\N	\N
506	47	489	5	Pleural space	f	\N	\N	\N
507	47	506	1	Normal	f	\N	\N	\N
508	47	506	2	Pleural effusion	f	\N	\N	\N
509	47	506	3	Pneumothorax	f	\N	\N	\N
510	47	489	6	Mediastinum	f	\N	\N	\N
511	47	510	1	Normal	f	\N	\N	\N
512	47	510	2	Widened	f	\N	\N	\N
513	47	510	3	Lymphadenopathy	f	\N	\N	\N
514	47	489	7	Diaphragm	f	\N	\N	\N
515	47	514	1	Normal	f	\N	\N	\N
516	47	514	2	Elevated	f	\N	\N	\N
517	47	514	3	Flattened	f	\N	\N	\N
518	47	489	8	Hilar structures	f	\N	\N	\N
519	47	518	1	Normal	f	\N	\N	\N
520	47	518	2	Prominent	f	\N	\N	\N
521	47	489	9	Other findings	t	Other findings	Enter other findings	\N
522	48	\N	1	Without contrast	f	\N	\N	\N
523	48	\N	2	With contrast	f	\N	\N	\N
524	48	\N	3	CT pulmonary angiography (CTPA)	f	\N	\N	\N
525	48	\N	4	Findings	f	\N	\N	\N
526	48	525	1	Normal	f	\N	\N	\N
527	48	525	2	Pulmonary embolism	f	\N	\N	\N
528	48	525	3	Lung parenchymal abnormalities	f	\N	\N	\N
529	48	525	4	Pleural abnormalities	f	\N	\N	\N
530	48	525	5	Cardiac abnormalities	f	\N	\N	\N
531	48	525	6	Vascular abnormalities	f	\N	\N	\N
532	48	525	7	Other findings	t	Other findings	Enter other findings	\N
533	48	\N	5	Without contrast	f	\N	\N	\N
534	48	\N	6	With contrast	f	\N	\N	\N
535	48	\N	7	Findings	t	Findings	Enter findings	\N
536	48	\N	8	Without contrast	f	\N	\N	\N
537	48	\N	9	With contrast	f	\N	\N	\N
538	48	\N	10	Findings	t	Findings	Enter findings	\N
539	49	\N	1	Transthoracic	f	\N	\N	\N
540	49	\N	2	Transesophageal	f	\N	\N	\N
541	49	\N	3	Findings	f	\N	\N	\N
542	49	541	1	Cardiac chambers	f	\N	\N	\N
543	49	542	1	Normal size and function	f	\N	\N	\N
544	49	542	2	Left ventricular dilatation	f	\N	\N	\N
545	49	542	3	Right ventricular dilatation	f	\N	\N	\N
546	49	542	4	Left atrial dilatation	f	\N	\N	\N
547	49	542	5	Right atrial dilatation	f	\N	\N	\N
548	49	541	2	Ejection fraction	t	Ejection fraction	Enter ejection fraction	\N
549	49	541	3	Valvular function	f	\N	\N	\N
550	49	549	1	Normal	f	\N	\N	\N
551	49	549	2	Stenosis (specify valve)	t	Stenosis (specify valve)	Enter stenosis (specify valve)	\N
552	49	549	3	Regurgitation (specify valve)	t	Regurgitation (specify valve)	Enter regurgitation (specify valve)	\N
553	49	541	4	Septal defects	f	\N	\N	\N
554	49	553	1	Atrial septal defect	f	\N	\N	\N
555	49	553	2	Ventricular septal defect	f	\N	\N	\N
556	49	553	3	Patent foramen ovale	f	\N	\N	\N
557	49	541	5	Pericardial effusion	f	\N	\N	\N
558	49	541	6	Wall motion abnormalities	f	\N	\N	\N
559	49	541	7	Pulmonary artery pressure estimate	t	Pulmonary artery pressure estimate	Enter pulmonary artery pressure estimate	\N
560	49	541	8	Other findings	t	Other findings	Enter other findings	\N
561	49	\N	4	Arterial Doppler (specify location)	t	Arterial Doppler (specify location)	Enter arterial doppler (specify location)	\N
562	49	\N	5	Venous Doppler (specify location)	t	Venous Doppler (specify location)	Enter venous doppler (specify location)	\N
563	49	\N	6	Findings	f	\N	\N	\N
564	49	563	1	Normal flow	f	\N	\N	\N
565	49	563	2	Thrombosis/occlusion	f	\N	\N	\N
566	49	563	3	Stenosis	f	\N	\N	\N
567	49	563	4	Other	t	Other	Enter other	\N
568	49	\N	7	Abdominal ultrasound	f	\N	\N	\N
569	49	\N	8	Renal ultrasound	f	\N	\N	\N
570	49	\N	9	Other	t	Other	Enter other	\N
571	49	\N	10	Findings	t	Findings	Enter findings	\N
572	50	\N	1	Normal	f	\N	\N	\N
573	50	\N	2	Low probability for pulmonary embolism	f	\N	\N	\N
574	50	\N	3	Intermediate probability for pulmonary embolism	f	\N	\N	\N
575	50	\N	4	High probability for pulmonary embolism	f	\N	\N	\N
576	50	\N	5	Nondiagnostic	f	\N	\N	\N
577	50	\N	6	Other perfusion abnormalities	t	Other perfusion abnormalities	Enter other perfusion abnormalities	\N
578	51	\N	1	MRI heart	f	\N	\N	\N
579	51	\N	2	MRI brain	f	\N	\N	\N
580	51	\N	3	MRI other (specify)	t	MRI other (specify)	Enter mri other (specify)	\N
581	51	\N	4	Findings	t	Findings	Enter findings	\N
582	52	\N	1	Pulmonary angiography	f	\N	\N	\N
583	52	\N	2	Coronary angiography	f	\N	\N	\N
762	73	\N	6	Hepatitis (K75.9)	f	\N	\N	\N
584	52	\N	3	Peripheral angiography (specify)	t	Peripheral angiography (specify)	Enter peripheral angiography (specify)	\N
585	52	\N	4	Findings	t	Findings	Enter findings	\N
586	53	\N	1	Myocardial perfusion scan	f	\N	\N	\N
587	53	\N	2	Other (specify)	t	Other (specify)	Enter other (specify)	\N
588	53	\N	3	Findings	t	Findings	Enter findings	\N
589	54	\N	1	Specify	t	Specify	Enter specify	\N
590	54	\N	2	Findings	t	Findings	Enter findings	\N
591	55	\N	1	Hemoglobin	t	Hemoglobin	Enter hemoglobin	\N
592	55	\N	2	Hematocrit	t	Hematocrit	Enter hematocrit	\N
593	55	\N	3	White blood cell count	t	White blood cell count	Enter white blood cell count	\N
594	55	\N	4	Platelet count	t	Platelet count	Enter platelet count	\N
595	55	\N	5	Red blood cell count	t	Red blood cell count	Enter red blood cell count	\N
596	55	\N	6	Mean corpuscular volume	t	Mean corpuscular volume	Enter mean corpuscular volume	\N
597	55	\N	7	Mean corpuscular hemoglobin	t	Mean corpuscular hemoglobin	Enter mean corpuscular hemoglobin	\N
598	55	\N	8	Mean corpuscular hemoglobin concentration	t	Mean corpuscular hemoglobin concentration	Enter mean corpuscular hemoglobin concentration	\N
599	55	\N	9	Red cell distribution width	t	Red cell distribution width	Enter red cell distribution width	\N
600	56	\N	1	Neutrophils	t	Neutrophils	Enter neutrophils	_____ x10^9/L
601	56	\N	2	Lymphocytes	t	Lymphocytes	Enter lymphocytes	_____ x10^9/L
602	56	\N	3	Monocytes	t	Monocytes	Enter monocytes	_____ x10^9/L
603	56	\N	4	Eosinophils	t	Eosinophils	Enter eosinophils	_____ x10^9/L
604	56	\N	5	Basophils	t	Basophils	Enter basophils	_____ x10^9/L
605	56	\N	6	Band forms	t	Band forms	Enter band forms	_____ x10^9/L
606	57	\N	1	Normal	f	\N	\N	\N
607	57	\N	2	Abnormal RBC morphology (specify)	t	Abnormal RBC morphology (specify)	Enter abnormal rbc morphology (specify)	\N
608	57	\N	3	RBC fragments	f	\N	\N	\N
609	57	\N	4	Abnormal WBC morphology (specify)	t	Abnormal WBC morphology (specify)	Enter abnormal wbc morphology (specify)	\N
610	57	\N	5	Platelet abnormalities (specify)	t	Platelet abnormalities (specify)	Enter platelet abnormalities (specify)	\N
611	57	\N	6	Other abnormalities	t	Other abnormalities	Enter other abnormalities	\N
612	58	\N	1	Sodium	t	Sodium	Enter sodium	\N
613	58	\N	2	Potassium	t	Potassium	Enter potassium	\N
614	58	\N	3	Chloride	t	Chloride	Enter chloride	\N
615	58	\N	4	Bicarbonate	t	Bicarbonate	Enter bicarbonate	\N
616	58	\N	5	Blood urea nitrogen	t	Blood urea nitrogen	Enter blood urea nitrogen	\N
617	58	\N	6	Creatinine	t	Creatinine	Enter creatinine	\N
618	58	\N	7	Glucose	t	Glucose	Enter glucose	\N
619	58	\N	8	Calcium	t	Calcium	Enter calcium	\N
620	58	\N	9	Albumin	t	Albumin	Enter albumin	\N
621	58	\N	10	Total protein	t	Total protein	Enter total protein	\N
622	58	\N	11	Bilirubin total	t	Bilirubin total	Enter bilirubin total	\N
623	58	\N	12	Bilirubin direct	t	Bilirubin direct	Enter bilirubin direct	\N
624	58	\N	13	AST	t	AST	Enter ast	\N
625	58	\N	14	ALT	t	ALT	Enter alt	\N
626	58	\N	15	Alkaline phosphatase	t	Alkaline phosphatase	Enter alkaline phosphatase	\N
627	58	\N	16	Lactate dehydrogenase	t	Lactate dehydrogenase	Enter lactate dehydrogenase	\N
628	59	\N	1	pH	t	pH	Enter ph	\N
629	59	\N	2	pCO2	t	pCO2	Enter pco2	\N
630	59	\N	3	pO2	t	pO2	Enter po2	\N
631	59	\N	4	HCO3	t	HCO3	Enter hco3	\N
632	59	\N	5	Base excess	t	Base excess	Enter base excess	\N
633	59	\N	6	SaO2 (measured)	t	SaO2 (measured)	Enter sao2 (measured)	\N
634	59	\N	7	SaO2 (calculated)	t	SaO2 (calculated)	Enter sao2 (calculated)	\N
635	59	\N	8	A-a gradient	t	A-a gradient	Enter a-a gradient	\N
636	59	\N	9	Oxygen saturation gap (calculated - measured)	t	Oxygen saturation gap (calculated - measured)	Enter oxygen saturation gap (calculated - measured)	\N
637	59	\N	10	Lactate	t	Lactate	Enter lactate	\N
638	59	\N	11	Methemoglobin level	t	Methemoglobin level	Enter methemoglobin level	\N
639	59	\N	12	Carboxyhemoglobin level	t	Carboxyhemoglobin level	Enter carboxyhemoglobin level	\N
640	59	\N	13	Sulfhemoglobin level	t	Sulfhemoglobin level	Enter sulfhemoglobin level	\N
641	60	\N	1	Oxyhemoglobin	t	Oxyhemoglobin	Enter oxyhemoglobin	\N
642	60	\N	2	Deoxyhemoglobin	t	Deoxyhemoglobin	Enter deoxyhemoglobin	\N
643	60	\N	3	Methemoglobin	t	Methemoglobin	Enter methemoglobin	\N
644	60	\N	4	Carboxyhemoglobin	t	Carboxyhemoglobin	Enter carboxyhemoglobin	\N
645	60	\N	5	Sulfhemoglobin	t	Sulfhemoglobin	Enter sulfhemoglobin	\N
646	60	\N	6	Total hemoglobin	t	Total hemoglobin	Enter total hemoglobin	\N
647	61	\N	1	Prothrombin time	t	Prothrombin time	Enter prothrombin time	\N
648	61	\N	2	International normalized ratio	t	International normalized ratio	Enter international normalized ratio	\N
649	61	\N	3	Partial thromboplastin time	t	Partial thromboplastin time	Enter partial thromboplastin time	\N
650	61	\N	4	D-dimer	t	D-dimer	Enter d-dimer	\N
651	61	\N	5	Fibrinogen	t	Fibrinogen	Enter fibrinogen	\N
652	62	\N	1	Troponin I	t	Troponin I	Enter troponin i	\N
653	62	\N	2	Troponin T	t	Troponin T	Enter troponin t	\N
654	62	\N	3	CK-MB	t	CK-MB	Enter ck-mb	\N
655	62	\N	4	Brain natriuretic peptide	t	Brain natriuretic peptide	Enter brain natriuretic peptide	\N
656	62	\N	5	NT-proBNP	t	NT-proBNP	Enter nt-probnp	\N
657	63	\N	1	NADH methemoglobin reductase activity	f	\N	\N	\N
658	63	\N	2	G6PD level/activity	f	\N	\N	\N
659	63	\N	3	Hemoglobin electrophoresis	f	\N	\N	\N
660	63	\N	4	Methemoglobin to hemoglobin ratio	f	\N	\N	\N
763	73	\N	7	Pancreatitis (K85.9)	f	\N	\N	\N
661	63	\N	5	Erythrocyte sedimentation rate	t	Erythrocyte sedimentation rate	Enter erythrocyte sedimentation rate	\N
662	63	\N	6	C-reactive protein	t	C-reactive protein	Enter c-reactive protein	\N
663	64	\N	1	Toxicology screen	f	\N	\N	\N
664	64	\N	2	Specific drug levels (specify)	t	Specific drug levels (specify)	Enter specific drug levels (specify)	\N
665	65	\N	1	Blood cultures	f	\N	\N	\N
666	65	\N	2	Urine culture	f	\N	\N	\N
667	65	\N	3	Sputum culture	f	\N	\N	\N
668	65	\N	4	Cerebrospinal fluid analysis/culture	f	\N	\N	\N
669	65	\N	5	Other culture (specify)	t	Other culture (specify)	Enter other culture (specify)	\N
670	66	\N	1	Thyroid function tests	f	\N	\N	\N
671	66	\N	2	Liver function panel	f	\N	\N	\N
672	66	\N	3	Renal function panel	f	\N	\N	\N
673	66	\N	4	Iron studies	f	\N	\N	\N
674	66	\N	5	Vitamin B12/folate levels	f	\N	\N	\N
675	66	\N	6	Ammonia level	f	\N	\N	\N
676	66	\N	7	Inflammatory markers	f	\N	\N	\N
677	66	\N	8	Autoimmune panel	f	\N	\N	\N
678	66	\N	9	Other (specify)	t	Other (specify)	Enter other (specify)	\N
679	67	\N	1	Drop of blood on filter paper test	f	\N	\N	\N
680	67	679	1	Blood turns bright red with 100% oxygen (normal)	f	\N	\N	\N
681	67	679	2	No color change with 100% oxygen (suggestive of methemoglobinemia)	f	\N	\N	\N
682	67	\N	2	Urine dipstick	f	\N	\N	\N
683	67	\N	3	Stool guaiac	f	\N	\N	\N
684	68	\N	1	Congenital heart disease (Q24.9)	f	\N	\N	\N
685	68	684	1	Type	t	Type	Enter type	\N
686	68	\N	2	Coronary artery disease (I25.10)	f	\N	\N	\N
687	68	\N	3	Myocardial infarction (I25.2)	f	\N	\N	\N
688	68	\N	4	Heart failure (I50.9)	f	\N	\N	\N
689	68	688	1	Preserved ejection fraction (I50.3)	f	\N	\N	\N
690	68	688	2	Reduced ejection fraction (I50.2)	f	\N	\N	\N
691	68	\N	5	Valvular disease (I38)	f	\N	\N	\N
692	68	691	1	Type	t	Type	Enter type	\N
693	68	\N	6	Dysrhythmia (I49.9)	f	\N	\N	\N
694	68	693	1	Atrial fibrillation (I48.91)	f	\N	\N	\N
695	68	693	2	Other	t	Other	Enter other	\N
696	68	\N	7	Hypertension (I10)	f	\N	\N	\N
697	68	\N	8	Pulmonary hypertension (I27.0)	f	\N	\N	\N
698	68	\N	9	Asthma (J45.909)	f	\N	\N	\N
699	68	\N	10	COPD (J44.9)	f	\N	\N	\N
700	68	\N	11	Emphysema (J43.9)	f	\N	\N	\N
701	68	\N	12	Chronic bronchitis (J41.0)	f	\N	\N	\N
702	68	\N	13	Pulmonary fibrosis (J84.10)	f	\N	\N	\N
703	68	\N	14	Interstitial lung disease (J84.9)	f	\N	\N	\N
704	68	\N	15	Pneumonia (J18.9)	f	\N	\N	\N
705	68	\N	16	Pulmonary embolism (I26.99)	f	\N	\N	\N
706	68	\N	17	Tuberculosis (A15.9)	f	\N	\N	\N
707	68	\N	18	Sleep apnea (G47.33)	f	\N	\N	\N
708	68	\N	19	Pulmonary edema (J81.0)	f	\N	\N	\N
709	68	\N	20	Chronic cyanosis (R23.0)	f	\N	\N	\N
710	69	\N	1	Anemia (D64.9)	f	\N	\N	\N
711	69	710	1	Iron deficiency (D50.9)	f	\N	\N	\N
712	69	710	2	Vitamin B12 deficiency (D51.9)	f	\N	\N	\N
713	69	710	3	Folate deficiency (D52.9)	f	\N	\N	\N
714	69	710	4	Hemolytic (D59.9)	f	\N	\N	\N
715	69	710	5	Sickle cell (D57.1)	f	\N	\N	\N
716	69	710	6	Thalassemia (D56.9)	f	\N	\N	\N
717	69	\N	2	Polycythemia (D75.1)	f	\N	\N	\N
718	69	717	1	Polycythemia vera (D45)	f	\N	\N	\N
719	69	717	2	Secondary polycythemia (D75.1)	f	\N	\N	\N
720	69	\N	3	Coagulopathy (D68.9)	f	\N	\N	\N
721	69	\N	4	Thrombotic disorders (D68.9)	f	\N	\N	\N
722	69	\N	5	G6PD deficiency (D55.0)	f	\N	\N	\N
723	69	\N	6	Methemoglobinemia (D74.0)	f	\N	\N	\N
724	69	723	1	Congenital (D74.0)	f	\N	\N	\N
725	69	723	2	Acquired (D74.8)	f	\N	\N	\N
726	69	\N	7	Hereditary hemoglobinopathy (D58.9)	f	\N	\N	\N
727	69	\N	8	Leukemia (C95.9)	f	\N	\N	\N
728	69	\N	9	Lymphoma (C85.9)	f	\N	\N	\N
729	69	\N	10	Bone marrow disorders (D75.9)	f	\N	\N	\N
730	70	\N	1	Peripheral vascular disease (I73.9)	f	\N	\N	\N
731	70	\N	2	Deep vein thrombosis (I82.409)	f	\N	\N	\N
732	70	\N	3	Raynaud phenomenon (I73.00)	f	\N	\N	\N
733	70	\N	4	Vasculitis (I77.6)	f	\N	\N	\N
734	70	\N	5	Aortic aneurysm (I71.9)	f	\N	\N	\N
735	70	\N	6	Arteriovenous malformations (Q27.9)	f	\N	\N	\N
736	70	\N	7	Varicose veins (I83.90)	f	\N	\N	\N
737	71	\N	1	Stroke (I63.9)	f	\N	\N	\N
738	71	\N	2	Transient ischemic attack (G45.9)	f	\N	\N	\N
739	71	\N	3	Seizure disorder (G40.909)	f	\N	\N	\N
740	71	\N	4	Migraine (G43.909)	f	\N	\N	\N
741	71	\N	5	Neuropathy (G62.9)	f	\N	\N	\N
742	71	\N	6	Myopathy (G72.9)	f	\N	\N	\N
743	71	\N	7	Multiple sclerosis (G35)	f	\N	\N	\N
744	71	\N	8	Parkinson's disease (G20)	f	\N	\N	\N
745	71	\N	9	Dementia (G30.9)	f	\N	\N	\N
746	72	\N	1	Diabetes mellitus	f	\N	\N	\N
747	72	746	1	Type 1 (E10.9)	f	\N	\N	\N
748	72	746	2	Type 2 (E11.9)	f	\N	\N	\N
749	72	746	3	Gestational (O24.419)	f	\N	\N	\N
750	72	\N	2	Thyroid disorders	f	\N	\N	\N
751	72	750	1	Hypothyroidism (E03.9)	f	\N	\N	\N
752	72	750	2	Hyperthyroidism (E05.90)	f	\N	\N	\N
753	72	\N	3	Adrenal disorders (E27.9)	f	\N	\N	\N
754	72	\N	4	Pituitary disorders (E23.7)	f	\N	\N	\N
755	73	\N	1	Gastroesophageal reflux disease (K21.9)	f	\N	\N	\N
756	73	\N	2	Peptic ulcer disease (K27.9)	f	\N	\N	\N
757	73	\N	3	Inflammatory bowel disease	f	\N	\N	\N
758	73	757	1	Crohn's disease (K50.90)	f	\N	\N	\N
759	73	757	2	Ulcerative colitis (K51.90)	f	\N	\N	\N
760	73	\N	4	Irritable bowel syndrome (K58.9)	f	\N	\N	\N
761	73	\N	5	Cirrhosis (K74.60)	f	\N	\N	\N
764	73	\N	8	Gallbladder disease (K82.9)	f	\N	\N	\N
765	74	\N	1	Chronic kidney disease (N18.9)	f	\N	\N	\N
766	74	765	1	Stage	t	Stage	Enter stage	\N
767	74	\N	2	End-stage renal disease (N18.6)	f	\N	\N	\N
768	74	\N	3	Dialysis dependent	f	\N	\N	\N
769	74	\N	4	Kidney stones (N20.0)	f	\N	\N	\N
770	74	\N	5	Polycystic kidney disease (Q61.3)	f	\N	\N	\N
771	74	\N	6	Glomerulonephritis (N05.9)	f	\N	\N	\N
772	75	\N	1	Cardiac surgery	f	\N	\N	\N
773	75	772	1	Type	t	Type	Enter type	\N
774	75	772	2	Date	t	Date	Enter date	\N
775	75	\N	2	Pulmonary surgery	f	\N	\N	\N
776	75	775	1	Type	t	Type	Enter type	\N
777	75	775	2	Date	t	Date	Enter date	\N
778	75	\N	3	Vascular surgery	f	\N	\N	\N
779	75	778	1	Type	t	Type	Enter type	\N
780	75	778	2	Date	t	Date	Enter date	\N
781	75	\N	4	Other major surgeries	t	Other major surgeries	Enter other major surgeries	\N
782	76	\N	1	Cancer (C80.1)	f	\N	\N	\N
783	76	782	1	Type	t	Type	Enter type	\N
784	76	782	2	Status	t	Status	Enter status	\N
785	76	\N	2	Autoimmune disorders (M35.9)	f	\N	\N	\N
786	76	\N	3	Immunodeficiency (D84.9)	f	\N	\N	\N
787	76	\N	4	Obesity (E66.9)	f	\N	\N	\N
788	76	\N	5	Other significant conditions	t	Other significant conditions	Enter other significant conditions	\N
789	77	\N	1	Explained diagnosis of	t	Explained diagnosis of	Enter explained diagnosis of	\N
790	77	\N	2	Discussed pathophysiology in patient-friendly terms	f	\N	\N	\N
791	77	\N	3	Reviewed natural history of condition	f	\N	\N	\N
792	77	\N	4	Provided written materials about condition	f	\N	\N	\N
793	77	\N	5	Advised on prognosis	f	\N	\N	\N
794	77	\N	6	Answered patient/family questions about diagnosis	f	\N	\N	\N
795	78	\N	1	Reviewed purpose of each medication	f	\N	\N	\N
796	78	\N	2	Discussed proper administration	f	\N	\N	\N
797	78	796	1	Timing	f	\N	\N	\N
798	78	796	2	Dosage	f	\N	\N	\N
799	78	796	3	Route	f	\N	\N	\N
800	78	796	4	With/without food	f	\N	\N	\N
801	78	\N	3	Reviewed potential side effects	f	\N	\N	\N
802	78	\N	4	Discussed drug interactions	f	\N	\N	\N
803	78	\N	5	Identified medications to avoid	f	\N	\N	\N
804	78	803	1	Medications that can cause/worsen methemoglobinemia	f	\N	\N	\N
805	78	803	2	Other contraindicated medications	f	\N	\N	\N
806	78	\N	6	Provided written medication list/schedule	f	\N	\N	\N
807	78	\N	7	Demonstrated proper use of devices (inhalers, etc.)	f	\N	\N	\N
808	79	\N	1	Discussed avoidance of medications that can cause methemoglobinemia	f	\N	\N	\N
809	79	808	1	Local anesthetics (benzocaine, lidocaine, prilocaine)	f	\N	\N	\N
810	79	808	2	Phenazopyridine (Pyridium)	f	\N	\N	\N
811	79	808	3	Dapsone	f	\N	\N	\N
812	79	808	4	Sulfonamides	f	\N	\N	\N
813	79	808	5	Other	t	Other	Enter other	\N
814	79	\N	2	Discussed avoidance of chemicals that can cause methemoglobinemia	f	\N	\N	\N
815	79	814	1	Aniline dyes	f	\N	\N	\N
816	79	814	2	Nitrates/nitrites	f	\N	\N	\N
817	79	814	3	Well water with high nitrate levels	f	\N	\N	\N
818	79	814	4	Other	t	Other	Enter other	\N
819	79	\N	3	Occupational exposure precautions	f	\N	\N	\N
820	79	\N	4	Environmental exposure precautions	f	\N	\N	\N
821	80	\N	1	Self-monitoring of symptoms	f	\N	\N	\N
822	80	821	1	Cyanosis (blue discoloration)	f	\N	\N	\N
823	80	821	2	Shortness of breath	f	\N	\N	\N
824	80	821	3	Fatigue	f	\N	\N	\N
825	80	821	4	Headache	f	\N	\N	\N
826	80	821	5	Mental status changes	f	\N	\N	\N
827	80	\N	2	Home oxygen use (if prescribed)	f	\N	\N	\N
828	80	827	1	Proper flow rate	f	\N	\N	\N
829	80	827	2	Safety precautions	f	\N	\N	\N
830	80	827	3	Equipment maintenance	f	\N	\N	\N
831	80	\N	3	Pulse oximetry monitoring (if prescribed)	f	\N	\N	\N
832	80	831	1	Frequency of checks	f	\N	\N	\N
833	80	831	2	Normal range	f	\N	\N	\N
834	80	831	3	When to call provider	f	\N	\N	\N
835	81	\N	1	Activity restrictions (if any)	t	Activity restrictions (if any)	Enter activity restrictions (if any)	\N
836	81	\N	2	Safe exercise levels	f	\N	\N	\N
837	81	\N	3	Gradual return to normal activities	f	\N	\N	\N
838	81	\N	4	Avoiding high altitude	f	\N	\N	\N
839	81	\N	5	Avoiding cold exposure	f	\N	\N	\N
840	81	\N	6	Other activity recommendations	t	Other activity recommendations	Enter other activity recommendations	\N
841	82	\N	1	General nutrition advice	f	\N	\N	\N
842	82	\N	2	Sodium restriction (if indicated)	f	\N	\N	\N
843	82	\N	3	Fluid restriction (if indicated)	f	\N	\N	\N
844	82	\N	4	Avoidance of foods high in nitrates (if indicated)	f	\N	\N	\N
845	82	\N	5	Avoidance of well water (if indicated)	f	\N	\N	\N
846	82	\N	6	Other dietary recommendations	t	Other dietary recommendations	Enter other dietary recommendations	\N
847	83	\N	1	Return to emergency department for:	f	\N	\N	\N
848	83	847	1	Worsening or new cyanosis (blue discoloration)	f	\N	\N	\N
849	83	847	2	Difficulty breathing	f	\N	\N	\N
850	83	847	3	Chest pain	f	\N	\N	\N
851	83	847	4	Syncope or near-syncope	f	\N	\N	\N
852	83	847	5	Confusion or altered mental status	f	\N	\N	\N
853	83	847	6	Severe headache	f	\N	\N	\N
854	83	847	7	Other concerning symptoms	t	Other concerning symptoms	Enter other concerning symptoms	\N
855	83	\N	2	Call healthcare provider for:	f	\N	\N	\N
856	83	855	1	Mild worsening of symptoms	f	\N	\N	\N
857	83	855	2	Questions about medications	f	\N	\N	\N
858	83	855	3	Non-urgent concerns	f	\N	\N	\N
859	83	855	4	Other	t	Other	Enter other	\N
860	84	\N	1	Discussed hereditary nature of condition	f	\N	\N	\N
861	84	\N	2	Explained inheritance pattern	f	\N	\N	\N
862	84	\N	3	Recommended genetic testing for family members	f	\N	\N	\N
863	84	\N	4	Provided information about genetic counseling services	f	\N	\N	\N
864	84	\N	5	Discussed implications for family planning	f	\N	\N	\N
865	85	\N	1	Scheduled follow-up appointments	f	\N	\N	\N
866	85	\N	2	Importance of keeping appointments	f	\N	\N	\N
867	85	\N	3	Laboratory tests needed before next visit	f	\N	\N	\N
868	85	\N	4	Imaging studies needed before next visit	f	\N	\N	\N
869	85	\N	5	Documentation to bring to next appointment	f	\N	\N	\N
870	85	\N	6	Other follow-up instructions	t	Other follow-up instructions	Enter other follow-up instructions	\N
871	86	\N	1	Written educational materials	f	\N	\N	\N
872	86	\N	2	Reputable website recommendations	f	\N	\N	\N
873	86	\N	3	Support group information	f	\N	\N	\N
874	86	\N	4	Medical alert bracelet information	f	\N	\N	\N
875	86	\N	5	Smartphone apps for tracking symptoms/medications	f	\N	\N	\N
876	86	\N	6	Social services resources	f	\N	\N	\N
877	86	\N	7	Other resources	t	Other resources	Enter other resources	\N
878	87	\N	1	Patient/family verbalized understanding	f	\N	\N	\N
879	87	\N	2	Questions answered to patient/family satisfaction	f	\N	\N	\N
880	87	\N	3	Teach-back method used to confirm understanding	f	\N	\N	\N
881	87	\N	4	Interpreter used (if applicable)	f	\N	\N	\N
882	87	\N	5	Written materials provided in preferred language	f	\N	\N	\N
883	88	\N	1	Temperature	t	Temperature	Enter temperature	\N
884	88	\N	2	Heart rate	t	Heart rate	Enter heart rate	\N
885	88	\N	3	Respiratory rate	t	Respiratory rate	Enter respiratory rate	\N
886	88	\N	4	Blood pressure	t	Blood pressure	Enter blood pressure	\N
887	88	\N	5	Oxygen saturation	t	Oxygen saturation	Enter oxygen saturation	\N
888	88	\N	6	Oxygen saturation	t	Oxygen saturation	Enter oxygen saturation	_____ L/min
889	88	\N	7	Pulse oximetry response to oxygen	t	Pulse oximetry response to oxygen	Enter pulse oximetry response to oxygen	\N
890	89	\N	1	Well-appearing	f	\N	\N	\N
891	89	\N	2	Ill-appearing	f	\N	\N	\N
892	89	\N	3	Distressed	f	\N	\N	\N
893	89	\N	4	Diaphoretic	f	\N	\N	\N
894	89	\N	5	Cyanotic	f	\N	\N	\N
895	89	\N	6	Pale	f	\N	\N	\N
896	89	\N	7	Lethargic	f	\N	\N	\N
897	89	\N	8	Anxious	f	\N	\N	\N
898	89	\N	9	Altered mental status (R41.82)	f	\N	\N	\N
899	90	\N	1	Cyanosis (R23.0)	f	\N	\N	\N
900	90	899	1	Central (perioral, oral mucosa, tongue, conjunctivae)	f	\N	\N	\N
901	90	899	2	Peripheral (extremities, nail beds)	f	\N	\N	\N
902	90	899	3	Differential (upper/lower body or right/left)	f	\N	\N	\N
903	90	\N	2	Color of peripheral blood	t	Color of peripheral blood	Enter color of peripheral blood	\N
904	90	903	1	Normal red	f	\N	\N	\N
905	90	903	2	Chocolate-brown (methemoglobinemia)	f	\N	\N	\N
906	90	903	3	Dark purple	f	\N	\N	\N
907	90	\N	3	Response to oxygen	t	Response to oxygen	Enter response to oxygen	\N
908	90	\N	4	Pallor (R23.1)	f	\N	\N	\N
909	90	\N	5	Jaundice (R17)	f	\N	\N	\N
910	90	\N	6	Diaphoresis (R61)	f	\N	\N	\N
911	90	\N	7	Petechiae (R23.3)	f	\N	\N	\N
912	90	\N	8	Purpura (D69.2)	f	\N	\N	\N
913	90	\N	9	Splinter hemorrhages (R23.8)	f	\N	\N	\N
914	90	\N	10	Digital clubbing (R68.3)	f	\N	\N	\N
915	90	\N	11	Edema (R60.9)	f	\N	\N	\N
916	90	\N	12	Skin lesions (L98.9)	f	\N	\N	\N
917	90	\N	13	Rash (R21)	f	\N	\N	\N
918	91	\N	1	Conjunctival pallor/cyanosis	f	\N	\N	\N
919	91	\N	2	Perioral cyanosis	f	\N	\N	\N
920	91	\N	3	Oral mucosa cyanosis	f	\N	\N	\N
921	91	\N	4	Icterus	f	\N	\N	\N
922	91	\N	5	Pharyngeal erythema/exudate	f	\N	\N	\N
923	91	\N	6	Tracheal deviation	f	\N	\N	\N
924	91	\N	7	Jugular venous distention (R22.1)	f	\N	\N	\N
925	91	\N	8	Tongue appearance	t	Tongue appearance	Enter tongue appearance	\N
926	92	\N	1	Respiratory effort	f	\N	\N	\N
927	92	926	1	Normal	f	\N	\N	\N
928	92	926	2	Increased	f	\N	\N	\N
929	92	926	3	Labored	f	\N	\N	\N
930	92	926	4	Use of accessory muscles	f	\N	\N	\N
931	92	926	5	Intercostal retractions	f	\N	\N	\N
932	92	926	6	Subcostal retractions	f	\N	\N	\N
933	92	926	7	Suprasternal retractions	f	\N	\N	\N
934	92	\N	2	Breath sounds	f	\N	\N	\N
935	92	934	1	Clear	f	\N	\N	\N
936	92	934	2	Diminished	f	\N	\N	\N
937	92	934	3	Absent	f	\N	\N	\N
938	92	934	4	Crackles (R09.89)	f	\N	\N	\N
939	92	934	5	Wheezes (R06.2)	f	\N	\N	\N
940	92	934	6	Rhonchi (R09.89)	f	\N	\N	\N
941	92	934	7	Stridor (R06.1)	f	\N	\N	\N
942	92	\N	3	Percussion	f	\N	\N	\N
943	92	942	1	Normal	f	\N	\N	\N
944	92	942	2	Hyperresonant (pneumothorax)	f	\N	\N	\N
945	92	942	3	Dull (consolidation/effusion)	f	\N	\N	\N
946	92	\N	4	Tactile fremitus	f	\N	\N	\N
947	92	946	1	Normal	f	\N	\N	\N
948	92	946	2	Increased	f	\N	\N	\N
949	92	946	3	Decreased	f	\N	\N	\N
950	93	\N	1	Heart rhythm	f	\N	\N	\N
951	93	950	1	Regular	f	\N	\N	\N
952	93	950	2	Irregular	f	\N	\N	\N
953	93	\N	2	Heart sounds	f	\N	\N	\N
954	93	953	1	Normal S1/S2	f	\N	\N	\N
955	93	953	2	S3 gallop (R01.2)	f	\N	\N	\N
956	93	953	3	S4 gallop (R01.2)	f	\N	\N	\N
957	93	953	4	Murmur (R01.1)	f	\N	\N	\N
958	93	957	1	Systolic	f	\N	\N	\N
959	93	957	2	Diastolic	f	\N	\N	\N
960	93	957	3	Continuous	f	\N	\N	\N
961	93	957	4	Location	t	Location	Enter location	\N
962	93	957	5	Intensity	t	Intensity	Enter intensity	\N
963	93	957	6	Radiation	t	Radiation	Enter radiation	\N
964	93	\N	3	Point of maximal impulse	f	\N	\N	\N
965	93	964	1	Normal	f	\N	\N	\N
966	93	964	2	Displaced	f	\N	\N	\N
967	93	964	3	Diffuse	f	\N	\N	\N
968	93	\N	4	Pulses	f	\N	\N	\N
969	93	968	1	Normal	f	\N	\N	\N
970	93	968	2	Weak	f	\N	\N	\N
971	93	968	3	Absent	f	\N	\N	\N
972	93	968	4	Symmetric	f	\N	\N	\N
973	93	968	5	Asymmetric	f	\N	\N	\N
974	93	\N	5	Capillary refill time	t	Capillary refill time	Enter capillary refill time	\N
975	93	974	1	Normal (<2 seconds)	f	\N	\N	\N
976	93	974	2	Delayed (>2 seconds)	f	\N	\N	\N
977	94	\N	1	Appearance	f	\N	\N	\N
978	94	977	1	Normal	f	\N	\N	\N
979	94	977	2	Distended	f	\N	\N	\N
980	94	977	3	Scaphoid	f	\N	\N	\N
981	94	\N	2	Bowel sounds	f	\N	\N	\N
982	94	981	1	Normal	f	\N	\N	\N
983	94	981	2	Hyperactive	f	\N	\N	\N
984	94	981	3	Hypoactive	f	\N	\N	\N
985	94	981	4	Absent	f	\N	\N	\N
986	94	\N	3	Tenderness	f	\N	\N	\N
987	94	986	1	None	f	\N	\N	\N
988	94	986	2	Localized	f	\N	\N	\N
989	94	986	3	Diffuse	f	\N	\N	\N
990	94	\N	4	Hepatomegaly (R16.0)	f	\N	\N	\N
991	94	\N	5	Splenomegaly (R16.1)	f	\N	\N	\N
992	94	\N	6	Abdominal bruit (R09.89)	f	\N	\N	\N
993	94	\N	7	Masses (R22.2)	f	\N	\N	\N
994	94	\N	8	Ascites (R18.8)	f	\N	\N	\N
995	95	\N	1	Edema	f	\N	\N	\N
996	95	995	1	None	f	\N	\N	\N
997	95	995	2	Pitting	f	\N	\N	\N
998	95	995	3	Non-pitting	f	\N	\N	\N
999	95	995	4	Location	t	Location	Enter location	\N
1000	95	\N	2	Cyanosis	f	\N	\N	\N
1001	95	1000	1	None	f	\N	\N	\N
1002	95	1000	2	Present	f	\N	\N	\N
1003	95	1000	3	Location	t	Location	Enter location	\N
1004	95	\N	3	Digital clubbing (R68.3)	f	\N	\N	\N
1005	95	\N	4	Temperature	f	\N	\N	\N
1006	95	1005	1	Warm	f	\N	\N	\N
1007	95	1005	2	Cool	f	\N	\N	\N
1008	95	1005	3	Cold	f	\N	\N	\N
1009	95	1005	4	Symmetric	f	\N	\N	\N
1010	95	1005	5	Asymmetric	f	\N	\N	\N
1011	95	\N	5	Hair distribution	f	\N	\N	\N
1012	95	1011	1	Normal	f	\N	\N	\N
1013	95	1011	2	Decreased (suggestive of vascular disease)	f	\N	\N	\N
1014	95	\N	6	Ulcers (L97.9)	f	\N	\N	\N
1015	95	\N	7	Gangrene (I96)	f	\N	\N	\N
1016	96	\N	1	Mental status	f	\N	\N	\N
1017	96	1016	1	Alert	f	\N	\N	\N
1018	96	1016	2	Confused	f	\N	\N	\N
1019	96	1016	3	Lethargic	f	\N	\N	\N
1020	96	1016	4	Obtunded	f	\N	\N	\N
1021	96	1016	5	Comatose	f	\N	\N	\N
1022	96	\N	2	Glasgow Coma Scale	t	Glasgow Coma Scale	Enter glasgow coma scale	E___V___M___
1023	96	\N	3	Orientation	f	\N	\N	\N
1024	96	1023	1	Person	f	\N	\N	\N
1025	96	1023	2	Place	f	\N	\N	\N
1026	96	1023	3	Time	f	\N	\N	\N
1027	96	1023	4	Situation	f	\N	\N	\N
1028	96	\N	4	Pupillary response	f	\N	\N	\N
1029	96	1028	1	Normal	f	\N	\N	\N
1030	96	1028	2	Abnormal	f	\N	\N	\N
1031	96	\N	5	Motor strength	f	\N	\N	\N
1032	96	1031	1	Normal (5/5)	f	\N	\N	\N
1033	96	1031	2	Decreased (specify grade and location)	t	Decreased (specify grade and location)	Enter decreased (specify grade and location)	\N
1034	96	\N	6	Sensory exam	f	\N	\N	\N
1035	96	1034	1	Normal	f	\N	\N	\N
1036	96	1034	2	Abnormal (specify)	t	Abnormal (specify)	Enter abnormal (specify)	\N
1037	96	\N	7	Coordination	f	\N	\N	\N
1038	96	1037	1	Normal	f	\N	\N	\N
1039	96	1037	2	Abnormal	f	\N	\N	\N
1040	96	\N	8	Gait	f	\N	\N	\N
1041	96	1040	1	Normal	f	\N	\N	\N
1042	96	1040	2	Abnormal	f	\N	\N	\N
1043	96	\N	9	Reflexes	f	\N	\N	\N
1044	96	1043	1	Normal	f	\N	\N	\N
1045	96	1043	2	Hyperreflexia	f	\N	\N	\N
1046	96	1043	3	Hyporeflexia	f	\N	\N	\N
1047	96	1043	4	Clonus	f	\N	\N	\N
1048	97	\N	1	Supplemental oxygen	f	\N	\N	\N
1049	97	1048	1	Nasal cannula at _____ L/min	f	\N	\N	\N
1050	97	1048	2	Face mask at _____ L/min	f	\N	\N	\N
1051	97	1048	3	Non-rebreather mask at _____ L/min	f	\N	\N	\N
1052	97	1048	4	High-flow nasal cannula at _____ L/min, FiO2 _____%	f	\N	\N	\N
1053	97	\N	2	Airway management	f	\N	\N	\N
1054	97	1053	1	Endotracheal intubation	f	\N	\N	\N
1055	97	1053	2	Mechanical ventilation settings	t	Mechanical ventilation settings	Enter mechanical ventilation settings	\N
1056	97	1053	3	Noninvasive positive pressure ventilation	f	\N	\N	\N
1057	97	1056	1	CPAP at _____ cmH2O	f	\N	\N	\N
1058	97	1056	2	BiPAP at _____ / _____ cmH2O	f	\N	\N	\N
1059	97	\N	3	Hemodynamic support	f	\N	\N	\N
1060	97	1059	1	Intravenous fluid resuscitation	f	\N	\N	\N
1061	97	1060	1	Type	t	Type	Enter type	\N
1062	97	1060	2	Volume	t	Volume	Enter volume	\N
1063	97	1060	3	Rate	t	Rate	Enter rate	\N
1064	97	1059	2	Vasopressors	f	\N	\N	\N
1065	97	1064	1	Norepinephrine at _____ mcg/kg/min	f	\N	\N	\N
1066	97	1064	2	Dopamine at _____ mcg/kg/min	f	\N	\N	\N
1067	97	1064	3	Epinephrine at _____ mcg/kg/min	f	\N	\N	\N
1068	97	1064	4	Vasopressin at _____ units/min	f	\N	\N	\N
1069	97	1059	3	Inotropes	f	\N	\N	\N
1070	97	1069	1	Dobutamine at _____ mcg/kg/min	f	\N	\N	\N
1071	97	1069	2	Milrinone at _____ mcg/kg/min	f	\N	\N	\N
1072	97	\N	4	Methemoglobinemia treatment	f	\N	\N	\N
1073	97	1072	1	Methylene blue 1-2 mg/kg IV over 5 minutes	f	\N	\N	\N
1074	97	1072	2	Ascorbic acid (vitamin C) for G6PD-deficient patients	f	\N	\N	\N
1075	97	1072	3	N-acetylcysteine	f	\N	\N	\N
1076	97	1072	4	Exchange transfusion	f	\N	\N	\N
1077	97	\N	5	Other immediate interventions	f	\N	\N	\N
1078	97	1077	1	Surface decontamination	f	\N	\N	\N
1079	97	1077	2	Needle decompression for tension pneumothorax	f	\N	\N	\N
1080	97	1077	3	Chest tube placement	f	\N	\N	\N
1081	97	1077	4	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1082	98	\N	1	Laboratory studies	f	\N	\N	\N
1083	98	1082	1	Complete blood count with differential	f	\N	\N	\N
1084	98	1082	2	Basic metabolic panel	f	\N	\N	\N
1085	98	1082	3	Arterial blood gas	f	\N	\N	\N
1086	98	1082	4	Methemoglobin level	f	\N	\N	\N
1087	98	1082	5	CO-oximetry	f	\N	\N	\N
1088	98	1082	6	Coagulation studies	f	\N	\N	\N
1089	98	1082	7	Cardiac markers	f	\N	\N	\N
1090	98	1082	8	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1091	98	\N	2	Imaging	f	\N	\N	\N
1092	98	1091	1	Chest radiograph	f	\N	\N	\N
1093	98	1091	2	CT pulmonary angiography	f	\N	\N	\N
1094	98	1091	3	Echocardiogram	f	\N	\N	\N
1095	98	1091	4	Ultrasound (specify)	t	Ultrasound (specify)	Enter ultrasound (specify)	\N
1096	98	1091	5	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1097	98	\N	3	Cardiac testing	f	\N	\N	\N
1098	98	1097	1	12-lead ECG	f	\N	\N	\N
1099	98	1097	2	Cardiac monitoring	f	\N	\N	\N
1100	98	1097	3	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1101	98	\N	4	Special testing	f	\N	\N	\N
1102	98	1101	1	Pulmonary function tests	f	\N	\N	\N
1103	98	1101	2	NADH-methemoglobin reductase activity	f	\N	\N	\N
1104	98	1101	3	G6PD level	f	\N	\N	\N
1105	98	1101	4	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1106	99	\N	1	Continue current medications	f	\N	\N	\N
1107	99	\N	2	Discontinue medication(s) suspected of causing methemoglobinemia	t	Discontinue medication(s) suspected of causing methemoglobinemia	Enter discontinue medication(s) suspected of causing methemoglobinemia	\N
1108	99	\N	3	New medications	f	\N	\N	\N
1109	99	1108	1	Antibiotics (specify)	t	Antibiotics (specify)	Enter antibiotics (specify)	\N
1110	99	1108	2	Bronchodilators (specify)	t	Bronchodilators (specify)	Enter bronchodilators (specify)	\N
1111	99	1108	3	Corticosteroids (specify)	t	Corticosteroids (specify)	Enter corticosteroids (specify)	\N
1112	99	1108	4	Diuretics (specify)	t	Diuretics (specify)	Enter diuretics (specify)	\N
1113	99	1108	5	Anticoagulants	f	\N	\N	\N
1114	99	1113	1	Unfractionated heparin	f	\N	\N	\N
1115	99	1113	2	Low molecular weight heparin	f	\N	\N	\N
1116	99	1113	3	Direct oral anticoagulants	f	\N	\N	\N
1117	99	1108	6	Nitroglycerin	f	\N	\N	\N
1118	99	1108	7	Analgesics (specify)	t	Analgesics (specify)	Enter analgesics (specify)	\N
1119	99	1108	8	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1120	100	\N	1	Cardiology	f	\N	\N	\N
1121	100	\N	2	Pulmonology	f	\N	\N	\N
1122	100	\N	3	Critical care	f	\N	\N	\N
1123	100	\N	4	Hematology	f	\N	\N	\N
1124	100	\N	5	Toxicology	f	\N	\N	\N
1125	100	\N	6	Poison control center	f	\N	\N	\N
1126	100	\N	7	Vascular surgery	f	\N	\N	\N
1127	100	\N	8	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1128	101	\N	1	Continuous pulse oximetry	f	\N	\N	\N
1129	101	\N	2	Continuous cardiac monitoring	f	\N	\N	\N
1130	101	\N	3	Blood pressure monitoring	f	\N	\N	\N
1131	101	1130	1	Frequency: q_____ hours	f	\N	\N	\N
1132	101	1130	2	Invasive arterial line	f	\N	\N	\N
1133	101	\N	4	Respiratory monitoring	f	\N	\N	\N
1134	101	1133	1	Respiratory rate	f	\N	\N	\N
1135	101	1133	2	Work of breathing	f	\N	\N	\N
1136	101	1133	3	Serial arterial blood gases	f	\N	\N	\N
1137	101	1133	4	End-tidal CO2	f	\N	\N	\N
1138	101	\N	5	Serial methemoglobin levels	f	\N	\N	\N
1139	101	\N	6	Neurological status	f	\N	\N	\N
1140	101	\N	7	Fluid status	f	\N	\N	\N
1141	101	\N	8	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1142	102	\N	1	Repeat methemoglobin level in _____ hours	f	\N	\N	\N
1143	102	\N	2	Repeat arterial blood gas in _____ hours	f	\N	\N	\N
1144	102	\N	3	Repeat complete blood count in _____ hours	f	\N	\N	\N
1145	102	\N	4	Repeat chest radiograph in _____ hours/days	f	\N	\N	\N
1146	102	\N	5	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1147	103	\N	1	Oxygen therapy	f	\N	\N	\N
1148	103	\N	2	IV hydration	f	\N	\N	\N
1149	103	\N	3	Nutrition plan	f	\N	\N	\N
1150	103	\N	4	Thromboprophylaxis	f	\N	\N	\N
1151	103	\N	5	Physical therapy	f	\N	\N	\N
1152	103	\N	6	Respiratory therapy	f	\N	\N	\N
1153	103	\N	7	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1154	104	\N	1	DVT prophylaxis	f	\N	\N	\N
1155	104	1154	1	Pharmacological (specify)	t	Pharmacological (specify)	Enter pharmacological (specify)	\N
1156	104	1154	2	Mechanical (specify)	t	Mechanical (specify)	Enter mechanical (specify)	\N
1157	104	\N	2	Stress ulcer prophylaxis	f	\N	\N	\N
1158	104	\N	3	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1159	105	\N	1	Warming for peripheral cyanosis due to cold exposure	f	\N	\N	\N
1160	105	\N	2	Peripheral vascular interventions	f	\N	\N	\N
1161	105	1160	1	Intra-arterial thrombolysis	f	\N	\N	\N
1162	105	1160	2	Embolectomy	f	\N	\N	\N
1163	105	1160	3	Vascular bypass	f	\N	\N	\N
1164	105	1160	4	Stenting	f	\N	\N	\N
1165	105	\N	3	Phlebotomy for polycythemia	f	\N	\N	\N
1166	105	\N	4	Calcium channel blockers for Raynaud phenomenon	f	\N	\N	\N
1167	105	\N	5	Topical nitroglycerin for Raynaud phenomenon	f	\N	\N	\N
1168	105	\N	6	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1169	106	\N	1	Fever (R50.9)	f	\N	\N	\N
1170	106	\N	2	Chills (R68.83)	f	\N	\N	\N
1171	106	\N	3	Fatigue (R53.83)	f	\N	\N	\N
1172	106	\N	4	Malaise (R53.81)	f	\N	\N	\N
1173	106	\N	5	Weight loss (R63.4)	f	\N	\N	\N
1174	106	\N	6	Weight gain (R63.5)	f	\N	\N	\N
1175	106	\N	7	Diaphoresis (R61)	f	\N	\N	\N
1176	106	\N	8	Night sweats (R61)	f	\N	\N	\N
1177	107	\N	1	Cyanosis (R23.0)	f	\N	\N	\N
1178	107	1177	1	Central	f	\N	\N	\N
1179	107	1177	2	Peripheral	f	\N	\N	\N
1180	107	1177	3	Differential	f	\N	\N	\N
1181	107	\N	2	Pallor (R23.1)	f	\N	\N	\N
1182	107	\N	3	Jaundice (R17)	f	\N	\N	\N
1183	107	\N	4	Diaphoresis (R61)	f	\N	\N	\N
1184	107	\N	5	Skin lesions (L98.9)	f	\N	\N	\N
1185	107	\N	6	Rash (R21)	f	\N	\N	\N
1186	107	\N	7	Pruritus (L29.9)	f	\N	\N	\N
1187	107	\N	8	Abnormal pigmentation (L81.9)	f	\N	\N	\N
1188	107	\N	9	Hair loss (L65.9)	f	\N	\N	\N
1189	108	\N	1	Headache (R51)	f	\N	\N	\N
1190	108	\N	2	Visual changes (H53.9)	f	\N	\N	\N
1191	108	\N	3	Diplopia (H53.2)	f	\N	\N	\N
1192	108	\N	4	Blurry vision (H53.8)	f	\N	\N	\N
1193	108	\N	5	Eye pain (H57.1)	f	\N	\N	\N
1194	108	\N	6	Tinnitus (H93.19)	f	\N	\N	\N
1195	108	\N	7	Vertigo (R42)	f	\N	\N	\N
1196	108	\N	8	Epistaxis (R04.0)	f	\N	\N	\N
1197	108	\N	9	Oral mucosa cyanosis (R23.0)	f	\N	\N	\N
1198	108	\N	10	Conjunctival pallor/cyanosis (R23.0)	f	\N	\N	\N
1199	109	\N	1	Dyspnea (R06.00)	f	\N	\N	\N
1200	109	1199	1	At rest	f	\N	\N	\N
1201	109	1199	2	With exertion	f	\N	\N	\N
1202	109	1199	3	Paroxysmal nocturnal	f	\N	\N	\N
1203	109	1199	4	Orthopnea	f	\N	\N	\N
1204	109	\N	2	Cough (R05)	f	\N	\N	\N
1205	109	1204	1	Dry	f	\N	\N	\N
1206	109	1204	2	Productive	f	\N	\N	\N
1207	109	1204	3	Hemoptysis (R04.2)	f	\N	\N	\N
1208	109	\N	3	Wheezing (R06.2)	f	\N	\N	\N
1209	109	\N	4	Chest tightness (R07.89)	f	\N	\N	\N
1210	109	\N	5	Tachypnea (R06.82)	f	\N	\N	\N
1211	109	\N	6	Shallow breathing	f	\N	\N	\N
1212	109	\N	7	Periodic apnea (R06.81)	f	\N	\N	\N
1213	109	\N	8	Stridor (R06.1)	f	\N	\N	\N
1214	109	\N	9	Respiratory distress (R06.00)	f	\N	\N	\N
1215	110	\N	1	Chest pain (R07.9)	f	\N	\N	\N
1216	110	1215	1	Exertional	f	\N	\N	\N
1217	110	1215	2	At rest	f	\N	\N	\N
1218	110	1215	3	Radiating	f	\N	\N	\N
1219	110	1215	4	Pleuritic	f	\N	\N	\N
1220	110	\N	2	Palpitations (R00.2)	f	\N	\N	\N
1221	110	\N	3	Tachycardia (R00.0)	f	\N	\N	\N
1222	110	\N	4	Bradycardia (R00.1)	f	\N	\N	\N
1223	110	\N	5	Irregular heartbeat (R00.8)	f	\N	\N	\N
1224	110	\N	6	Syncope (R55)	f	\N	\N	\N
1225	110	\N	7	Presyncope (R55)	f	\N	\N	\N
1226	110	\N	8	Extremity edema (R60.0)	f	\N	\N	\N
1227	110	\N	9	Decreased exercise tolerance (R53.1)	f	\N	\N	\N
1228	110	\N	10	Orthopnea (R06.01)	f	\N	\N	\N
1229	110	\N	11	Paroxysmal nocturnal dyspnea (R06.09)	f	\N	\N	\N
1230	110	\N	12	Jugular venous distention (R22.1)	f	\N	\N	\N
1231	111	\N	1	Nausea (R11.0)	f	\N	\N	\N
1232	111	\N	2	Vomiting (R11.10)	f	\N	\N	\N
1233	111	\N	3	Diarrhea (R19.7)	f	\N	\N	\N
1234	111	\N	4	Constipation (K59.00)	f	\N	\N	\N
1235	111	\N	5	Abdominal pain (R10.9)	f	\N	\N	\N
1236	111	\N	6	Melena (K92.1)	f	\N	\N	\N
1237	111	\N	7	Hematochezia (K92.2)	f	\N	\N	\N
1238	111	\N	8	Dysphagia (R13.10)	f	\N	\N	\N
1239	111	\N	9	Change in appetite (R63.0)	f	\N	\N	\N
1240	112	\N	1	Dysuria (R30.0)	f	\N	\N	\N
1241	112	\N	2	Frequency (R35.0)	f	\N	\N	\N
1242	112	\N	3	Urgency (R39.15)	f	\N	\N	\N
1243	112	\N	4	Hematuria (R31.9)	f	\N	\N	\N
1244	112	\N	5	Incontinence (R32)	f	\N	\N	\N
1245	112	\N	6	Oliguria (R34)	f	\N	\N	\N
1246	112	\N	7	Anuria (R34)	f	\N	\N	\N
1247	112	\N	8	Nocturia (R35.1)	f	\N	\N	\N
1248	113	\N	1	Muscle weakness (M62.81)	f	\N	\N	\N
1249	113	\N	2	Joint pain (M25.50)	f	\N	\N	\N
1250	113	\N	3	Muscle pain (M79.1)	f	\N	\N	\N
1251	113	\N	4	Limited range of motion (M25.9)	f	\N	\N	\N
1252	113	\N	5	Joint swelling (M25.40)	f	\N	\N	\N
1253	113	\N	6	Back pain (M54.9)	f	\N	\N	\N
1254	113	\N	7	Extremity pain (M79.609)	f	\N	\N	\N
1255	114	\N	1	Headache (R51)	f	\N	\N	\N
1256	114	\N	2	Dizziness (R42)	f	\N	\N	\N
1257	114	\N	3	Seizures (R56.9)	f	\N	\N	\N
1258	114	\N	4	Altered mental status (R41.82)	f	\N	\N	\N
1259	114	\N	5	Syncope (R55)	f	\N	\N	\N
1260	114	\N	6	Weakness (R53.1)	f	\N	\N	\N
1261	114	\N	7	Sensory changes (R20.9)	f	\N	\N	\N
1262	114	\N	8	Tremor (R25.1)	f	\N	\N	\N
1263	114	\N	9	Ataxia (R27.0)	f	\N	\N	\N
1264	114	\N	10	Memory changes (R41.3)	f	\N	\N	\N
1265	114	\N	11	Confusion (R41.0)	f	\N	\N	\N
1266	114	\N	12	Lethargy (R53.83)	f	\N	\N	\N
1267	115	\N	1	Anxiety (F41.9)	f	\N	\N	\N
1268	115	\N	2	Depression (F32.9)	f	\N	\N	\N
1269	115	\N	3	Sleep disturbances (G47.9)	f	\N	\N	\N
1270	115	\N	4	Mood changes (R45.89)	f	\N	\N	\N
1271	115	\N	5	Agitation (R45.1)	f	\N	\N	\N
1272	115	\N	6	Suicidal ideation (R45.851)	f	\N	\N	\N
1273	116	\N	1	Easy bruising (D69.9)	f	\N	\N	\N
1274	116	\N	2	Bleeding (R58)	f	\N	\N	\N
1275	116	\N	3	Lymphadenopathy (R59.9)	f	\N	\N	\N
1276	116	\N	4	Splenomegaly (R16.1)	f	\N	\N	\N
1277	116	\N	5	Hepatomegaly (R16.0)	f	\N	\N	\N
1278	116	\N	6	Petechiae (R23.3)	f	\N	\N	\N
1279	116	\N	7	Splinter hemorrhages (R23.8)	f	\N	\N	\N
1280	117	\N	1	Heat intolerance (E34.9)	f	\N	\N	\N
1281	117	\N	2	Cold intolerance (E34.9)	f	\N	\N	\N
1282	117	\N	3	Polyuria (R35.8)	f	\N	\N	\N
1283	117	\N	4	Polydipsia (R63.1)	f	\N	\N	\N
1284	117	\N	5	Polyphagia (R63.2)	f	\N	\N	\N
1285	117	\N	6	Hypoglycemia (E16.2)	f	\N	\N	\N
1286	117	\N	7	Hyperglycemia (R73.9)	f	\N	\N	\N
1287	118	\N	1	Environmental allergies (J30.9)	f	\N	\N	\N
1288	118	\N	2	Food allergies (Z91.011)	f	\N	\N	\N
1289	118	\N	3	Medication allergies (Z88.9)	f	\N	\N	\N
1290	118	\N	4	Recurrent infections (D84.9)	f	\N	\N	\N
1291	118	\N	5	Autoimmune disorders (M35.9)	f	\N	\N	\N
1292	119	\N	1	Age (infant, elderly)	f	\N	\N	\N
1293	119	\N	2	Pregnancy	f	\N	\N	\N
1294	119	\N	3	Altitude (>8000 ft)	f	\N	\N	\N
1295	119	\N	4	Recent travel	f	\N	\N	\N
1296	119	\N	5	Smoking status	f	\N	\N	\N
1297	119	1296	1	Current smoker	f	\N	\N	\N
1298	119	1296	2	Former smoker	f	\N	\N	\N
1299	119	1296	3	Never smoker	f	\N	\N	\N
1300	119	1296	4	Passive smoke exposure	f	\N	\N	\N
1301	119	\N	6	Alcohol use	f	\N	\N	\N
1302	119	\N	7	Illicit drug use	f	\N	\N	\N
1303	119	\N	8	Occupational exposures	f	\N	\N	\N
1304	120	\N	1	Hypertension (I10)	f	\N	\N	\N
1305	120	\N	2	Hyperlipidemia (E78.5)	f	\N	\N	\N
1306	120	\N	3	Diabetes mellitus (E11.9)	f	\N	\N	\N
1307	120	\N	4	Obesity (E66.9)	f	\N	\N	\N
1308	120	\N	5	Sedentary lifestyle (Z72.3)	f	\N	\N	\N
1309	120	\N	6	Family history of cardiovascular disease (Z82.49)	f	\N	\N	\N
1310	120	\N	7	Previous myocardial infarction (I25.2)	f	\N	\N	\N
1311	120	\N	8	Previous stroke (I69.9)	f	\N	\N	\N
1312	120	\N	9	Peripheral vascular disease (I73.9)	f	\N	\N	\N
1313	121	\N	1	Infant <4 months old (reduced NADH methemoglobin reductase activity)	f	\N	\N	\N
1314	121	\N	2	Low birth weight	f	\N	\N	\N
1315	121	\N	3	Prematurity	f	\N	\N	\N
1316	121	\N	4	Dehydration	f	\N	\N	\N
1317	121	\N	5	Acidosis	f	\N	\N	\N
1318	121	\N	6	Diarrhea	f	\N	\N	\N
1319	121	\N	7	Hyperchloremia	f	\N	\N	\N
1320	121	\N	8	Genetic factors	f	\N	\N	\N
1321	121	1320	1	NADH methemoglobin reductase deficiency	f	\N	\N	\N
1322	121	1320	2	Hemoglobin M	f	\N	\N	\N
1323	121	1320	3	G6PD deficiency	f	\N	\N	\N
1324	121	\N	9	Medication exposure	f	\N	\N	\N
1325	121	1324	1	Local anesthetics (benzocaine, lidocaine, prilocaine)	f	\N	\N	\N
1326	121	1324	2	Phenazopyridine (Pyridium)	f	\N	\N	\N
1327	121	1324	3	Nitroglycerin	f	\N	\N	\N
1328	121	1324	4	Nitroprusside	f	\N	\N	\N
1329	121	1324	5	Dapsone	f	\N	\N	\N
1330	121	1324	6	Metoclopramide	f	\N	\N	\N
1331	121	1324	7	Sulfonamides	f	\N	\N	\N
1332	121	1324	8	Antineoplastics (cyclophosphamide, ifosfamide, flutamide)	f	\N	\N	\N
1333	121	1324	9	Rasburicase	f	\N	\N	\N
1334	121	1324	10	Other	t	Other	Enter other	\N
1335	121	\N	10	Chemical exposure	f	\N	\N	\N
1336	121	1335	1	Aniline dyes	f	\N	\N	\N
1337	121	1335	2	Nitrates/nitrites	f	\N	\N	\N
1338	121	1335	3	Naphthalene	f	\N	\N	\N
1339	121	1335	4	Other	t	Other	Enter other	\N
1340	122	\N	1	Sulfonamide medications	f	\N	\N	\N
1341	122	\N	2	Sulfur-containing compounds	f	\N	\N	\N
1342	122	\N	3	Hydrogen sulfide exposure	f	\N	\N	\N
1343	122	\N	4	Gastrointestinal bacterial overgrowth	f	\N	\N	\N
1344	123	\N	1	Chronic obstructive pulmonary disease (J44.9)	f	\N	\N	\N
1345	123	\N	2	Asthma (J45.909)	f	\N	\N	\N
1346	123	\N	3	Interstitial lung disease (J84.9)	f	\N	\N	\N
1347	123	\N	4	Pulmonary fibrosis (J84.10)	f	\N	\N	\N
1348	123	\N	5	Cystic fibrosis (E84.9)	f	\N	\N	\N
1349	123	\N	6	Pulmonary hypertension (I27.0)	f	\N	\N	\N
1350	123	\N	7	Previous pulmonary embolism (I26.99)	f	\N	\N	\N
1351	123	\N	8	Hypercoagulability disorders (D68.9)	f	\N	\N	\N
1352	123	\N	9	Sleep apnea (G47.33)	f	\N	\N	\N
1353	123	\N	10	Previous tuberculosis (B90.9)	f	\N	\N	\N
1354	124	\N	1	Maternal diabetes	f	\N	\N	\N
1355	124	\N	2	Maternal alcohol use during pregnancy	f	\N	\N	\N
1356	124	\N	3	Maternal medication use during pregnancy	f	\N	\N	\N
1357	124	\N	4	Maternal infection during pregnancy	f	\N	\N	\N
1358	124	\N	5	Family history of congenital heart disease	f	\N	\N	\N
1359	124	\N	6	Genetic disorders (specify)	t	Genetic disorders (specify)	Enter genetic disorders (specify)	\N
1360	124	\N	7	Chromosomal abnormalities (specify)	t	Chromosomal abnormalities (specify)	Enter chromosomal abnormalities (specify)	\N
1361	125	\N	1	Cold exposure	f	\N	\N	\N
1362	125	\N	2	Raynaud phenomenon (I73.00)	f	\N	\N	\N
1363	125	\N	3	Peripheral vascular disease (I73.9)	f	\N	\N	\N
1364	125	\N	4	Deep vein thrombosis (I82.409)	f	\N	\N	\N
1365	125	\N	5	Arterial thrombosis/embolism (I74.9)	f	\N	\N	\N
1366	125	\N	6	Vasculitis (I77.6)	f	\N	\N	\N
1367	125	\N	7	Low cardiac output states	f	\N	\N	\N
1368	125	\N	8	Shock (R57.9)	f	\N	\N	\N
1369	126	\N	1	Spirometry	f	\N	\N	\N
1370	126	1369	1	FEV1	t	FEV1	Enter fev1	_____ % predicted
1371	126	1369	2	FVC	t	FVC	Enter fvc	_____ % predicted
1372	126	1369	3	FEV1/FVC ratio	t	FEV1/FVC ratio	Enter fev1/fvc ratio	\N
1373	126	1369	4	Results	f	\N	\N	\N
1374	126	1373	1	Normal	f	\N	\N	\N
1375	126	1373	2	Obstructive pattern	f	\N	\N	\N
1376	126	1373	3	Restrictive pattern	f	\N	\N	\N
1377	126	1373	4	Mixed pattern	f	\N	\N	\N
1378	126	\N	2	Lung volumes	f	\N	\N	\N
1379	126	1378	1	Total lung capacity	t	Total lung capacity	Enter total lung capacity	_____ % predicted
1380	126	1378	2	Residual volume	t	Residual volume	Enter residual volume	_____ % predicted
1381	126	1378	3	Functional residual capacity	t	Functional residual capacity	Enter functional residual capacity	_____ % predicted
1382	126	\N	3	Diffusion capacity	f	\N	\N	\N
1383	126	1382	1	DLCO	t	DLCO	Enter dlco	_____ % predicted
1384	126	\N	4	Bronchodilator response	f	\N	\N	\N
1385	126	1384	1	Significant	f	\N	\N	\N
1386	126	1384	2	Not significant	f	\N	\N	\N
1387	126	\N	5	Six-minute walk test	f	\N	\N	\N
1388	126	1387	1	Distance	t	Distance	Enter distance	\N
1389	126	1387	2	Oxygen saturation at baseline	t	Oxygen saturation at baseline	Enter oxygen saturation at baseline	\N
1390	126	1387	3	Oxygen saturation at end of test	t	Oxygen saturation at end of test	Enter oxygen saturation at end of test	\N
1391	127	\N	1	Hemoglobin electrophoresis	f	\N	\N	\N
1392	127	1391	1	Normal	f	\N	\N	\N
1393	127	1391	2	Abnormal (specify)	t	Abnormal (specify)	Enter abnormal (specify)	\N
1394	127	\N	2	Methemoglobin stability test	f	\N	\N	\N
1395	127	\N	3	Hemoglobin M test	f	\N	\N	\N
1396	127	\N	4	Sulfhemoglobin analysis	f	\N	\N	\N
1397	127	\N	5	NADH-methemoglobin reductase activity	t	NADH-methemoglobin reductase activity	Enter nadh-methemoglobin reductase activity	\N
1398	127	\N	6	G6PD activity	t	G6PD activity	Enter g6pd activity	\N
1399	128	\N	1	P50 (oxygen pressure at 50% hemoglobin saturation)	f	\N	\N	\N
1400	128	1399	1	Normal (26-28 mmHg)	f	\N	\N	\N
1401	128	1399	2	Shifted left (< 26 mmHg)	f	\N	\N	\N
1402	128	1399	3	Shifted right (> 28 mmHg)	f	\N	\N	\N
1403	128	\N	2	Oxygen saturation response to 100% O2	f	\N	\N	\N
1404	128	1403	1	Normal response (improved saturation)	f	\N	\N	\N
1405	128	1403	2	Poor response (minimal improvement)	f	\N	\N	\N
1406	128	1403	3	No response	f	\N	\N	\N
1407	128	\N	3	Calculated oxygen saturation gap	t	Calculated oxygen saturation gap	Enter calculated oxygen saturation gap	\N
1408	129	\N	1	Exercise stress test	f	\N	\N	\N
1409	129	1408	1	Protocol	t	Protocol	Enter protocol	\N
1410	129	1408	2	Duration	t	Duration	Enter duration	\N
1411	129	1408	3	Maximum heart rate	t	Maximum heart rate	Enter maximum heart rate	_____ % of predicted
1412	129	1408	4	Maximum blood pressure	t	Maximum blood pressure	Enter maximum blood pressure	\N
1413	129	1408	5	Symptoms during test	t	Symptoms during test	Enter symptoms during test	\N
1414	129	1408	6	ECG changes	t	ECG changes	Enter ecg changes	\N
1415	129	1408	7	Result	f	\N	\N	\N
1416	129	1415	1	Negative for ischemia	f	\N	\N	\N
1417	129	1415	2	Positive for ischemia	f	\N	\N	\N
1418	129	1415	3	Indeterminate	f	\N	\N	\N
1419	129	\N	2	Pharmacologic stress test	f	\N	\N	\N
1420	129	1419	1	Agent used	t	Agent used	Enter agent used	\N
1421	129	1419	2	Result	t	Result	Enter result	\N
1422	129	\N	3	Tilt table test	f	\N	\N	\N
1423	129	1422	1	Result	t	Result	Enter result	\N
1424	130	\N	1	Electroencephalogram (EEG)	f	\N	\N	\N
1425	130	1424	1	Normal	f	\N	\N	\N
1426	130	1424	2	Abnormal (specify)	t	Abnormal (specify)	Enter abnormal (specify)	\N
1427	130	\N	2	Electromyography (EMG)/Nerve conduction studies	f	\N	\N	\N
1428	130	1427	1	Normal	f	\N	\N	\N
1429	130	1427	2	Abnormal (specify)	t	Abnormal (specify)	Enter abnormal (specify)	\N
1430	130	\N	3	Cognitive function testing	f	\N	\N	\N
1431	130	1430	1	Mini-Mental State Examination	t	Mini-Mental State Examination	Enter mini-mental state examination	\N
1432	130	1430	2	Montreal Cognitive Assessment	t	Montreal Cognitive Assessment	Enter montreal cognitive assessment	\N
1433	130	1430	3	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1434	131	\N	1	Ankle-brachial index (ABI)	f	\N	\N	\N
1435	131	1434	1	Right	t	Right	Enter right	\N
1436	131	1434	2	Left	t	Left	Enter left	\N
1437	131	1434	3	Interpretation	t	Interpretation	Enter interpretation	\N
1438	131	\N	2	Transcutaneous oxygen pressure (TcPO2)	f	\N	\N	\N
1439	131	1438	1	Value	t	Value	Enter value	\N
1440	131	1438	2	Location measured	t	Location measured	Enter location measured	\N
1441	131	\N	3	Cold stimulation test (for Raynaud's)	f	\N	\N	\N
1442	131	1441	1	Positive	f	\N	\N	\N
1443	131	1441	2	Negative	f	\N	\N	\N
1444	132	\N	1	Polysomnography	f	\N	\N	\N
1445	132	1444	1	Apnea-Hypopnea Index	t	Apnea-Hypopnea Index	Enter apnea-hypopnea index	\N
1446	132	1444	2	Oxygen desaturation	t	Oxygen desaturation	Enter oxygen desaturation	\N
1447	132	1444	3	Other findings	t	Other findings	Enter other findings	\N
1448	132	\N	2	Home sleep apnea testing	f	\N	\N	\N
1449	132	1448	1	Results	t	Results	Enter results	\N
1450	133	\N	1	Specific methemoglobinemia-causing agent levels	f	\N	\N	\N
1451	133	1450	1	Dapsone	f	\N	\N	\N
1452	133	1450	2	Benzocaine	f	\N	\N	\N
1453	133	1450	3	Lidocaine	f	\N	\N	\N
1454	133	1450	4	Prilocaine	f	\N	\N	\N
1455	133	1450	5	Nitrites/nitrates	f	\N	\N	\N
1456	133	1450	6	Other (specify)	t	Other (specify)	Enter other (specify)	\N
1457	133	\N	2	Drug screen	f	\N	\N	\N
1458	133	1457	1	Results	t	Results	Enter results	\N
1459	134	\N	1	Bronchoprovocation testing	f	\N	\N	\N
1460	134	1459	1	Methacholine challenge	f	\N	\N	\N
1461	134	1459	2	Exercise challenge	f	\N	\N	\N
1462	134	1459	3	Cold air challenge	f	\N	\N	\N
1463	134	1459	4	Result	t	Result	Enter result	\N
1464	134	\N	2	Exhaled nitric oxide (FeNO)	f	\N	\N	\N
1465	134	1464	1	Value	t	Value	Enter value	\N
1466	134	1464	2	Interpretation	t	Interpretation	Enter interpretation	\N
1467	134	\N	3	Sputum analysis	f	\N	\N	\N
1468	134	1467	1	Eosinophil count	t	Eosinophil count	Enter eosinophil count	\N
1469	134	1467	2	Other findings	t	Other findings	Enter other findings	\N
1470	135	\N	1	Chocolate-brown blood color test	f	\N	\N	\N
1471	135	1470	1	Positive (suggestive of methemoglobinemia)	f	\N	\N	\N
1472	135	1470	2	Negative	f	\N	\N	\N
1473	135	\N	2	Filter paper test (blood color change with 100% oxygen)	f	\N	\N	\N
1474	135	1473	1	Normal (turns bright red)	f	\N	\N	\N
1475	135	1473	2	Abnormal (no color change - suggestive of methemoglobinemia)	f	\N	\N	\N
1476	136	\N	1	Age > 60 years	f	\N	\N	\N
1477	136	\N	2	Male gender	f	\N	\N	\N
1478	136	\N	3	Abnormal ECG findings	f	\N	\N	\N
1479	136	\N	4	Syncope during exertion	f	\N	\N	\N
1480	136	\N	5	Syncope in supine position	f	\N	\N	\N
1481	136	\N	6	Syncope without prodrome/warning	f	\N	\N	\N
1482	136	\N	7	Syncope with accompanying palpitations	f	\N	\N	\N
1483	136	\N	8	Family history of sudden cardiac death (< 50 years old)	f	\N	\N	\N
1484	137	\N	1	Myocardial infarction (I21.9)	f	\N	\N	\N
1485	137	\N	2	Life-threatening dysrhythmias	f	\N	\N	\N
1486	137	\N	3	Acute aortic dissection (I71.0)	f	\N	\N	\N
1487	137	\N	4	Critical aortic stenosis (I35.0)	f	\N	\N	\N
1488	137	\N	5	Hypertrophic cardiomyopathy (I42.1-I42.2)	f	\N	\N	\N
1489	137	\N	6	Pericardial tamponade (I31.9)	f	\N	\N	\N
1490	137	\N	7	Abdominal aortic aneurysm, ruptured (I71.3)	f	\N	\N	\N
1491	137	\N	8	Massive pulmonary embolism (I26.0)	f	\N	\N	\N
1492	137	\N	9	Subarachnoid hemorrhage (I60.9)	f	\N	\N	\N
1493	137	\N	10	Toxic-metabolic derangements	f	\N	\N	\N
1494	137	\N	11	Severe hypovolemia or hemorrhage	f	\N	\N	\N
1495	137	\N	12	Ruptured ectopic pregnancy (O00.1)	f	\N	\N	\N
1496	137	\N	13	Sepsis (A41.9)	f	\N	\N	\N
1497	138	\N	1	Systolic blood pressure < 90 mmHg or > 180 mmHg	f	\N	\N	\N
1498	138	\N	2	Elevated troponin level (>99th percentile)	f	\N	\N	\N
1499	138	\N	3	Abnormal QRS axis (<-30 degrees or >110 degrees)	f	\N	\N	\N
1500	138	\N	4	Prolonged QRS interval (>130 ms)	f	\N	\N	\N
1501	138	\N	5	Prolonged corrected QT interval (>480 ms)	f	\N	\N	\N
1502	138	\N	6	Hematocrit < 30%	f	\N	\N	\N
1503	138	\N	7	History of congestive heart failure (I50.9)	f	\N	\N	\N
1504	138	\N	8	History of cardiac arrhythmia (I49.9)	f	\N	\N	\N
1505	138	\N	9	Shortness of breath	f	\N	\N	\N
1506	138	\N	10	Elevated NT-proBNP (>125 pg/mL)	f	\N	\N	\N
1507	138	\N	11	Elevated high-sensitivity troponin T (>19 ng/L)	f	\N	\N	\N
1508	139	\N	1	Chest pain during episode	f	\N	\N	\N
1509	139	\N	2	Severe dyspnea	f	\N	\N	\N
1510	139	\N	3	Rapid heart rate/palpitations preceding syncope	f	\N	\N	\N
1511	139	\N	4	Heart murmur	f	\N	\N	\N
1512	140	\N	1	Severe headache with syncope	f	\N	\N	\N
1513	140	\N	2	Focal neurological deficits	f	\N	\N	\N
1514	140	\N	3	Post-episode confusion/cognitive changes	f	\N	\N	\N
1515	140	\N	4	Persistent alteration in mental status	f	\N	\N	\N
1516	141	\N	1	Abdominal/back pain with syncope	f	\N	\N	\N
1517	141	\N	2	GI bleeding (melena, hematochezia)	f	\N	\N	\N
1518	141	\N	3	Abdominal tenderness or distention	f	\N	\N	\N
1519	142	\N	1	Reflex (neurally mediated) syncope (R55)	f	\N	\N	\N
1520	142	1519	1	Vasovagal syncope	f	\N	\N	\N
1521	142	1519	2	Carotid sinus syndrome	f	\N	\N	\N
1522	142	1519	3	Situational syncope (specify	t	Situational syncope (specify	Enter situational syncope (specify	\N
1523	142	\N	2	Orthostatic syncope (I95.1)	f	\N	\N	\N
1524	142	1523	1	Drug-induced	f	\N	\N	\N
1525	142	1523	2	Volume depletion	f	\N	\N	\N
1526	142	1523	3	Primary autonomic failure	f	\N	\N	\N
1527	142	1523	4	Secondary autonomic failure	f	\N	\N	\N
1528	142	\N	3	Cardiac syncope	f	\N	\N	\N
1529	142	1528	1	Dysrhythmic (specify	t	Dysrhythmic (specify	Enter dysrhythmic (specify	\N
1530	142	1528	2	Structural (specify	t	Structural (specify	Enter structural (specify	\N
1531	142	1528	3	Cardiopulmonary (specify	t	Cardiopulmonary (specify	Enter cardiopulmonary (specify	\N
1532	142	\N	4	Neurologic cause (specify	t	Neurologic cause (specify	Enter neurologic cause (specify	\N
1533	142	\N	5	Metabolic/toxic cause (specify	t	Metabolic/toxic cause (specify	Enter metabolic/toxic cause (specify	\N
1534	142	\N	6	Syncope mimic (specify	t	Syncope mimic (specify	Enter syncope mimic (specify	\N
1535	142	\N	7	Unexplained syncope	f	\N	\N	\N
1536	143	\N	1	Definite diagnosis	f	\N	\N	\N
1537	143	\N	2	Highly probable diagnosis	f	\N	\N	\N
1538	143	\N	3	Probable diagnosis	f	\N	\N	\N
1539	143	\N	4	Possible diagnosis	f	\N	\N	\N
1540	143	\N	5	Diagnosis unclear	f	\N	\N	\N
1541	144	\N	1	Very low risk (e.g., Canadian Syncope Risk Score -2)	f	\N	\N	\N
1542	144	\N	2	Low risk (e.g., Canadian Syncope Risk Score -1 or 0)	f	\N	\N	\N
1543	144	\N	3	Medium risk (e.g., Canadian Syncope Risk Score 1-3)	f	\N	\N	\N
1544	144	\N	4	High risk (e.g., Canadian Syncope Risk Score >3)	f	\N	\N	\N
1545	145	\N	1	Predisposition to vasovagal syncope (-1)	f	\N	\N	\N
1546	145	\N	2	History of heart disease (+1)	f	\N	\N	\N
1547	145	\N	3	Any systolic BP <90 or >180 mmHg (+2)	f	\N	\N	\N
1548	145	\N	4	Troponin level >99th percentile (+2)	f	\N	\N	\N
1549	145	\N	5	Abnormal QRS axis (+1)	f	\N	\N	\N
1550	145	\N	6	QRS >130 ms (+1)	f	\N	\N	\N
1551	145	\N	7	QTc >480 ms (+2)	f	\N	\N	\N
1552	145	\N	8	ED diagnosis of vasovagal syncope (-2)	f	\N	\N	\N
1553	145	\N	9	ED diagnosis of cardiac syncope (+2)	f	\N	\N	\N
1554	145	\N	10	Total score	t	Total score	Enter total score	\N
1555	146	\N	1	History of heart failure (+1)	f	\N	\N	\N
1556	146	\N	2	History of cardiac arrhythmia (+1)	f	\N	\N	\N
1557	146	\N	3	Abnormal ECG (+1)	f	\N	\N	\N
1558	146	\N	4	Elevated NT-proBNP >125 pg/mL (+2)	f	\N	\N	\N
1559	146	\N	5	Elevated troponin T >19 ng/L (+1)	f	\N	\N	\N
1560	146	\N	6	Total score	t	Total score	Enter total score	\N
1561	147	\N	1	History of congestive heart failure	f	\N	\N	\N
1562	147	\N	2	Hematocrit <30%	f	\N	\N	\N
1563	147	\N	3	Abnormal ECG	f	\N	\N	\N
1564	147	\N	4	Shortness of breath	f	\N	\N	\N
1565	147	\N	5	Systolic BP <90 mmHg	f	\N	\N	\N
1566	147	\N	6	Positive rule (any of the above present)	f	\N	\N	\N
1567	147	\N	7	Negative rule (none of the above present)	f	\N	\N	\N
1568	148	\N	1	Low concern for serious underlying condition	f	\N	\N	\N
1569	148	\N	2	Moderate concern for serious underlying condition	f	\N	\N	\N
1570	148	\N	3	High concern for serious underlying condition	f	\N	\N	\N
1571	148	\N	4	Critical condition requiring immediate intervention	f	\N	\N	\N
1572	149	\N	1	No functional impairment	f	\N	\N	\N
1573	149	\N	2	Mild functional impairment	f	\N	\N	\N
1574	149	\N	3	Moderate functional impairment	f	\N	\N	\N
1575	149	\N	4	Severe functional impairment	f	\N	\N	\N
1576	150	\N	1	No injury from syncope/fall	f	\N	\N	\N
1577	150	\N	2	Minor injury from syncope/fall	f	\N	\N	\N
1578	150	\N	3	Significant injury from syncope/fall	f	\N	\N	\N
1579	150	\N	4	Traumatic brain injury from syncope/fall	f	\N	\N	\N
1580	151	\N	1	Event witnessed	f	\N	\N	\N
1581	151	\N	2	Event not witnessed	f	\N	\N	\N
1582	151	\N	3	Witness account available	f	\N	\N	\N
1583	151	\N	4	No witness account available	f	\N	\N	\N
1584	152	\N	1	Duration of loss of consciousness	t	Duration of loss of consciousness	Enter duration of loss of consciousness	\N
1585	152	\N	2	Complete collapse	f	\N	\N	\N
1586	152	\N	3	Partial collapse	f	\N	\N	\N
1587	152	\N	4	Fall resulting in injury	f	\N	\N	\N
1588	152	\N	5	No fall or injury	f	\N	\N	\N
1589	153	\N	1	Appeared normal before episode	f	\N	\N	\N
1590	153	\N	2	Appeared pale/diaphoretic	f	\N	\N	\N
1591	153	\N	3	Complained of feeling unwell	f	\N	\N	\N
1592	153	\N	4	Strange behavior noted	f	\N	\N	\N
1593	153	\N	5	Complained of specific symptoms	t	Complained of specific symptoms	Enter complained of specific symptoms	\N
1594	154	\N	1	Sudden onset	f	\N	\N	\N
1595	154	\N	2	Gradual onset	f	\N	\N	\N
1596	154	\N	3	Loss of postural tone (collapse)	f	\N	\N	\N
1597	154	\N	4	Eyes open	f	\N	\N	\N
1598	154	\N	5	Eyes closed	f	\N	\N	\N
1599	154	\N	6	Pallor	f	\N	\N	\N
1600	154	\N	7	Cyanosis	f	\N	\N	\N
1601	154	\N	8	Flushing	f	\N	\N	\N
1602	155	\N	1	No movements observed	f	\N	\N	\N
1603	155	\N	2	Brief myoclonic jerks (<20 jerks)	f	\N	\N	\N
1604	155	\N	3	Prolonged rhythmic movements (>20 jerks)	f	\N	\N	\N
1605	155	\N	4	Tonic posturing	f	\N	\N	\N
1606	155	\N	5	Clonic movements	f	\N	\N	\N
1607	155	\N	6	Tongue biting observed	f	\N	\N	\N
1608	155	\N	7	Head turning to one side	f	\N	\N	\N
1609	155	\N	8	Bilateral symmetric movements	f	\N	\N	\N
1610	155	\N	9	Asymmetric movements	f	\N	\N	\N
1611	156	\N	1	Urinary incontinence	f	\N	\N	\N
1612	156	\N	2	Fecal incontinence	f	\N	\N	\N
1613	156	\N	3	Vomiting	f	\N	\N	\N
1614	156	\N	4	Excessive salivation	f	\N	\N	\N
1615	157	\N	1	Rapid return to normal (seconds)	f	\N	\N	\N
1616	157	\N	2	Gradual return to normal (minutes)	f	\N	\N	\N
1617	157	\N	3	Prolonged recovery (>5 minutes)	f	\N	\N	\N
1618	157	\N	4	Post-episode confusion	f	\N	\N	\N
1619	157	\N	5	No post-episode confusion	f	\N	\N	\N
1620	157	\N	6	Speech difficulty after episode	f	\N	\N	\N
1621	157	\N	7	Drowsiness after episode	f	\N	\N	\N
1622	157	\N	8	Memory of event	f	\N	\N	\N
1623	157	\N	9	No memory of event	f	\N	\N	\N
1624	157	\N	10	Continued weakness after episode	f	\N	\N	\N
1625	157	\N	11	Tongue or cheek biting noted	f	\N	\N	\N
1626	158	\N	1	Initial vital signs: BP _____ HR _____ RR _____ O2 _____	f	\N	\N	\N
1627	158	\N	2	Initial blood glucose	t	Initial blood glucose	Enter initial blood glucose	\N
1628	158	\N	3	Interventions performed	t	Interventions performed	Enter interventions performed	\N
1629	158	\N	4	Response to interventions	t	Response to interventions	Enter response to interventions	\N
1630	159	\N	1	Vasovagal syncope (R55)	f	\N	\N	\N
1631	159	\N	2	Carotid sinus syndrome (G90.01)	f	\N	\N	\N
1632	159	\N	3	Situational syncope:	f	\N	\N	\N
1633	159	1632	1	Micturition syncope (R55)	f	\N	\N	\N
1634	159	1632	2	Defecation syncope (R55)	f	\N	\N	\N
1635	159	1632	3	Post-prandial syncope (R55)	f	\N	\N	\N
1636	159	1632	4	Cough syncope (R55)	f	\N	\N	\N
1637	159	1632	5	Swallow syncope (R55)	f	\N	\N	\N
1638	159	1632	6	Post-exercise syncope (R55)	f	\N	\N	\N
1639	159	1632	7	Sneeze syncope (R55)	f	\N	\N	\N
1640	159	1632	8	Valsalva-related syncope (R55)	f	\N	\N	\N
1641	159	1632	9	Laugh syncope (R55)	f	\N	\N	\N
1642	160	\N	1	Orthostatic hypotension (I95.1)	f	\N	\N	\N
1643	160	\N	2	Drug-induced orthostatic hypotension	f	\N	\N	\N
1644	160	\N	3	Volume depletion/dehydration (E86.0)	f	\N	\N	\N
1645	160	\N	4	Autonomic dysfunction (G90.9)	f	\N	\N	\N
1646	160	1645	1	Primary autonomic failure	f	\N	\N	\N
1647	160	1645	2	Secondary autonomic failure	f	\N	\N	\N
1648	160	\N	5	Blood loss/anemia (D64.9)	f	\N	\N	\N
1649	161	\N	1	Sinus node disease (I49.8)	f	\N	\N	\N
1650	161	1649	1	Sinus bradycardia <40 bpm (R00.1)	f	\N	\N	\N
1651	161	1649	2	Sinus pause >3 seconds (I49.5)	f	\N	\N	\N
1652	161	1649	3	Sick sinus syndrome (I49.5)	f	\N	\N	\N
1653	161	\N	2	Atrioventricular block	f	\N	\N	\N
1654	161	1653	1	Mobitz type II second-degree AV block (I44.1)	f	\N	\N	\N
1655	161	1653	2	Third-degree (complete) heart block (I44.2)	f	\N	\N	\N
1656	161	\N	3	Ventricular tachyarrhythmias	f	\N	\N	\N
1657	161	1656	1	Monomorphic ventricular tachycardia (I47.2)	f	\N	\N	\N
1658	161	1656	2	Polymorphic ventricular tachycardia/Torsades de pointes (I47.2)	f	\N	\N	\N
1659	161	1656	3	Ventricular fibrillation (I49.01)	f	\N	\N	\N
1660	161	\N	4	Supraventricular tachyarrhythmias	f	\N	\N	\N
1661	161	1660	1	Atrial flutter/fibrillation (I48.91)	f	\N	\N	\N
1662	161	1660	2	AV nodal reentry tachycardia (I47.1)	f	\N	\N	\N
1663	161	1660	3	AV reentry tachycardia (I47.1)	f	\N	\N	\N
1664	161	\N	5	Bundle branch block (I45.4)	f	\N	\N	\N
1665	161	1664	1	Alternating left and right bundle branch block	f	\N	\N	\N
1666	161	\N	6	Cardiac device malfunction	f	\N	\N	\N
1667	161	1666	1	Pacemaker malfunction (T82.119A)	f	\N	\N	\N
1668	161	1666	2	ICD malfunction (T82.119A)	f	\N	\N	\N
1669	161	1666	3	VAD dysfunction (T82.519A)	f	\N	\N	\N
1670	161	\N	7	Hypertrophic cardiomyopathy (I42.2)	f	\N	\N	\N
1671	161	\N	8	Aortic stenosis (I35.0)	f	\N	\N	\N
1672	161	\N	9	Severe pulmonic stenosis (I37.0)	f	\N	\N	\N
1673	161	\N	10	Acute myocardial infarction/ischemia (I21.9)	f	\N	\N	\N
1674	161	\N	11	Cardiac masses (e.g., atrial myxoma) (D15.11)	f	\N	\N	\N
1675	161	\N	12	Pericardial tamponade (I31.9)	f	\N	\N	\N
1676	161	\N	13	Prosthetic valve dysfunction (T82.09XA)	f	\N	\N	\N
1677	161	\N	14	Acute aortic dissection (I71.00)	f	\N	\N	\N
1678	161	\N	15	Pulmonary embolism (I26.99)	f	\N	\N	\N
1679	161	\N	16	Pulmonary hypertension (I27.0)	f	\N	\N	\N
1680	162	\N	1	Subarachnoid hemorrhage (I60.9)	f	\N	\N	\N
1681	162	\N	2	Vertebrobasilar TIA (G45.0)	f	\N	\N	\N
1682	162	\N	3	Subclavian steal syndrome (I77.89)	f	\N	\N	\N
1683	162	\N	4	Basilar artery migraine (G43.109)	f	\N	\N	\N
1684	162	\N	5	Cerebral hypoperfusion from other causes	f	\N	\N	\N
1685	163	\N	1	Hypoglycemia (E16.2)	f	\N	\N	\N
1686	163	\N	2	Hypoxemia (R09.02)	f	\N	\N	\N
1687	163	\N	3	Hyperventilation (R06.4)	f	\N	\N	\N
1688	163	\N	4	Carbon monoxide poisoning (T58.9XXA)	f	\N	\N	\N
1689	163	\N	5	Drug intoxication (F19.929)	f	\N	\N	\N
1690	163	\N	6	Alcohol intoxication (F10.929)	f	\N	\N	\N
1691	164	\N	1	Gastrointestinal hemorrhage (K92.2)	f	\N	\N	\N
1692	164	\N	2	Ruptured ectopic pregnancy (O00.1)	f	\N	\N	\N
1693	164	\N	3	Ruptured spleen (S36.09XA)	f	\N	\N	\N
1694	164	\N	4	Ruptured ovarian cyst (N83.209)	f	\N	\N	\N
1695	164	\N	5	Ruptured abdominal aortic aneurysm (I71.3)	f	\N	\N	\N
1696	164	\N	6	Sepsis (A41.9)	f	\N	\N	\N
1697	165	\N	1	Seizure/epilepsy (G40.909)	f	\N	\N	\N
1698	165	\N	2	Concussion/mild TBI (S06.0X9A)	f	\N	\N	\N
1699	165	\N	3	Mechanical fall (R29.6)	f	\N	\N	\N
1700	165	\N	4	Cataplexy (G47.4)	f	\N	\N	\N
1701	165	\N	5	Drop attacks (R55)	f	\N	\N	\N
1702	165	\N	6	Psychogenic pseudosyncope (F44.89)	f	\N	\N	\N
1703	165	\N	7	Narcolepsy (G47.419)	f	\N	\N	\N
1704	165	\N	8	Breath-holding spells (R06.89)	f	\N	\N	\N
1705	166	\N	1	Discharge to home	f	\N	\N	\N
1706	166	\N	2	Observation unit admission	f	\N	\N	\N
1707	166	\N	3	Inpatient admission	f	\N	\N	\N
1708	166	1707	1	Telemetry unit	f	\N	\N	\N
1709	166	1707	2	General medical unit	f	\N	\N	\N
1710	166	1707	3	Step-down unit	f	\N	\N	\N
1711	166	1707	4	Intensive care unit	f	\N	\N	\N
1712	166	\N	4	Transfer to another facility	f	\N	\N	\N
1713	167	\N	1	Based on specific identified cause	f	\N	\N	\N
1714	167	\N	2	Based on risk stratification	f	\N	\N	\N
1715	167	\N	3	Based on clinical risk score (specify	t	Based on clinical risk score (specify	Enter based on clinical risk score (specify	\N
1716	167	\N	4	Based on clinical gestalt	f	\N	\N	\N
1717	167	\N	5	Based on shared decision making with patient	f	\N	\N	\N
1718	167	\N	6	Based on patient's social circumstances	f	\N	\N	\N
1719	167	\N	7	Based on access to follow-up care	f	\N	\N	\N
1720	168	\N	1	Low risk for serious outcome	f	\N	\N	\N
1721	168	\N	2	Clear diagnosis with benign cause	f	\N	\N	\N
1722	168	\N	3	Adequate outpatient follow-up available	f	\N	\N	\N
1723	168	\N	4	Reliable patient/caregiver	f	\N	\N	\N
1724	168	\N	5	Safe home environment	f	\N	\N	\N
1725	168	\N	6	Access to transportation	f	\N	\N	\N
1726	168	\N	7	Medication access/adherence feasible	f	\N	\N	\N
1727	169	\N	1	Intermediate risk for serious outcome	f	\N	\N	\N
1728	169	\N	2	Need for extended monitoring	f	\N	\N	\N
1729	169	\N	3	Need for serial cardiac biomarkers	f	\N	\N	\N
1730	169	\N	4	Need for additional diagnostic testing	f	\N	\N	\N
1731	169	\N	5	Awaiting specialist consultation	f	\N	\N	\N
1732	169	\N	6	Medication adjustment/observation	f	\N	\N	\N
1733	169	\N	7	Social work/care coordination needed	f	\N	\N	\N
1734	170	\N	1	High risk for serious outcome	f	\N	\N	\N
1735	170	\N	2	Specific diagnosis requiring inpatient care	f	\N	\N	\N
1736	170	\N	3	Need for continuous cardiac monitoring	f	\N	\N	\N
1737	170	\N	4	Need for immediate intervention	f	\N	\N	\N
1738	170	\N	5	Need for specialist management	f	\N	\N	\N
1739	170	\N	6	Significant injury from syncope/fall	f	\N	\N	\N
1740	170	\N	7	Comorbidities requiring management	f	\N	\N	\N
1741	170	\N	8	Inadequate home support	f	\N	\N	\N
1742	171	\N	1	High-risk features present	f	\N	\N	\N
1743	171	\N	2	Abnormal ECG	f	\N	\N	\N
1744	171	\N	3	Cardiac biomarker elevation	f	\N	\N	\N
1745	171	\N	4	History of cardiac disease	f	\N	\N	\N
1746	171	\N	5	Unexplained syncope with risk factors	f	\N	\N	\N
1747	171	\N	6	Need for medication titration/monitoring	f	\N	\N	\N
1748	172	\N	1	Hemodynamic instability	f	\N	\N	\N
1749	172	\N	2	Life-threatening arrhythmia	f	\N	\N	\N
1750	172	\N	3	Severe structural heart disease	f	\N	\N	\N
1751	172	\N	4	Acute myocardial infarction	f	\N	\N	\N
1752	172	\N	5	Massive pulmonary embolism	f	\N	\N	\N
1753	172	\N	6	Aortic dissection	f	\N	\N	\N
1754	172	\N	7	Need for continuous invasive monitoring	f	\N	\N	\N
1755	173	\N	1	Need for higher level of care	f	\N	\N	\N
1756	173	\N	2	Need for specialized cardiac services	f	\N	\N	\N
1757	173	\N	3	Need for electrophysiology services	f	\N	\N	\N
1758	173	\N	4	Need for advanced imaging not available	f	\N	\N	\N
1759	173	\N	5	Insurance/network requirements	f	\N	\N	\N
1760	173	\N	6	Patient/family preference	f	\N	\N	\N
1761	174	\N	1	Heart rate	t	Heart rate	Enter heart rate	\N
1762	174	\N	2	Rhythm	t	Rhythm	Enter rhythm	\N
1763	174	\N	3	PR interval	t	PR interval	Enter pr interval	\N
1764	174	\N	4	QRS duration	t	QRS duration	Enter qrs duration	prolonged if >130 ms
1765	174	\N	5	QT interval	t	QT interval	Enter qt interval	\N
1766	174	\N	6	QTc interval	t	QTc interval	Enter qtc interval	prolonged if >480 ms
1767	174	\N	7	Axis	t	Axis	Enter axis	abnormal if <-30° or >110°
1768	175	\N	1	Normal sinus rhythm	f	\N	\N	\N
1769	175	\N	2	Sinus bradycardia (<60 bpm)	f	\N	\N	\N
1770	175	\N	3	Sinus bradycardia <40 bpm	f	\N	\N	\N
1771	175	\N	4	Sinus tachycardia (>100 bpm)	f	\N	\N	\N
1772	175	\N	5	Atrial fibrillation	f	\N	\N	\N
1773	175	\N	6	Atrial flutter	f	\N	\N	\N
1774	175	\N	7	Junctional rhythm	f	\N	\N	\N
1775	175	\N	8	Ventricular rhythm	f	\N	\N	\N
1776	175	\N	9	Agonal rhythm	f	\N	\N	\N
1777	176	\N	1	First-degree AV block (PR >200 ms)	f	\N	\N	\N
1778	176	\N	2	Second-degree AV block, Mobitz type I (Wenckebach)	f	\N	\N	\N
1779	176	\N	3	Second-degree AV block, Mobitz type II	f	\N	\N	\N
1780	176	\N	4	Third-degree (complete) AV block	f	\N	\N	\N
1781	176	\N	5	Right bundle branch block	f	\N	\N	\N
1782	176	\N	6	Left bundle branch block	f	\N	\N	\N
1783	176	\N	7	Left anterior fascicular block	f	\N	\N	\N
1784	176	\N	8	Left posterior fascicular block	f	\N	\N	\N
1785	176	\N	9	Alternating bundle branch block	f	\N	\N	\N
1786	176	\N	10	Sinus pause >3 seconds	f	\N	\N	\N
1787	176	\N	11	Pre-excitation (WPW pattern)	f	\N	\N	\N
1788	177	\N	1	Supraventricular tachycardia	f	\N	\N	\N
1789	177	\N	2	AV nodal reentry tachycardia	f	\N	\N	\N
1790	177	\N	3	AV reentry tachycardia	f	\N	\N	\N
1791	177	\N	4	Monomorphic ventricular tachycardia	f	\N	\N	\N
1792	177	\N	5	Polymorphic ventricular tachycardia	f	\N	\N	\N
1793	177	\N	6	Torsades de pointes	f	\N	\N	\N
1794	177	\N	7	Ventricular fibrillation	f	\N	\N	\N
1795	178	\N	1	ST-segment elevation (leads	t	ST-segment elevation (leads	Enter st-segment elevation (leads	\N
1796	178	\N	2	ST-segment depression (leads	t	ST-segment depression (leads	Enter st-segment depression (leads	\N
1797	178	\N	3	T-wave inversions (leads	t	T-wave inversions (leads	Enter t-wave inversions (leads	\N
1798	178	\N	4	Pathological Q waves (leads	t	Pathological Q waves (leads	Enter pathological q waves (leads	\N
1799	178	\N	5	Signs of acute myocardial ischemia	f	\N	\N	\N
1800	178	\N	6	Signs of old myocardial infarction	f	\N	\N	\N
1801	179	\N	1	Left ventricular hypertrophy	f	\N	\N	\N
1802	179	\N	2	Right ventricular hypertrophy	f	\N	\N	\N
1803	179	\N	3	Low voltage	f	\N	\N	\N
1804	179	\N	4	Electrical alternans	f	\N	\N	\N
1805	179	\N	5	Right ventricular strain pattern	f	\N	\N	\N
1806	179	\N	6	Brugada pattern (RBBB with ST elevation in V1-V3)	f	\N	\N	\N
1807	179	\N	7	Long QT pattern	f	\N	\N	\N
1808	179	\N	8	Short QT pattern	f	\N	\N	\N
1809	179	\N	9	Epsilon waves (ARVC)	f	\N	\N	\N
1810	179	\N	10	Early repolarization	f	\N	\N	\N
1811	179	\N	11	Diffuse ST elevation (pericarditis)	f	\N	\N	\N
1812	179	\N	12	J-point elevation	f	\N	\N	\N
1813	179	\N	13	Prominent U waves	f	\N	\N	\N
1814	179	\N	14	Osborn waves (hypothermia)	f	\N	\N	\N
1815	180	\N	1	No change from prior ECG	f	\N	\N	\N
1816	180	\N	2	New compared to prior ECG	t	New compared to prior ECG	Enter new compared to prior ecg	\N
1817	180	\N	3	No prior ECG for comparison	f	\N	\N	\N
1818	180	\N	4	Improvement from prior ECG	f	\N	\N	\N
1819	181	\N	1	No arrhythmias detected	f	\N	\N	\N
1820	181	\N	2	Arrhythmias detected	t	Arrhythmias detected	Enter arrhythmias detected	\N
1821	182	\N	1	Not performed	f	\N	\N	\N
1822	182	\N	2	Performed	f	\N	\N	\N
1823	182	\N	3	Normal cardiac silhouette	f	\N	\N	\N
1824	182	\N	4	Cardiomegaly	f	\N	\N	\N
1825	182	\N	5	Pulmonary edema	f	\N	\N	\N
1826	182	\N	6	Pulmonary vascular congestion	f	\N	\N	\N
1827	182	\N	7	Pleural effusion	f	\N	\N	\N
1828	182	\N	8	Pneumonia	f	\N	\N	\N
1829	182	\N	9	Pneumothorax	f	\N	\N	\N
1830	182	\N	10	Widened mediastinum	f	\N	\N	\N
1831	182	\N	11	Other findings	t	Other findings	Enter other findings	\N
1832	183	\N	1	Not performed	f	\N	\N	\N
1833	183	\N	2	Performed	f	\N	\N	\N
1834	183	\N	3	Normal	f	\N	\N	\N
1835	183	\N	4	Intracranial hemorrhage	f	\N	\N	\N
1836	183	\N	5	Subarachnoid hemorrhage	f	\N	\N	\N
1837	183	\N	6	Ischemic stroke	f	\N	\N	\N
1838	183	\N	7	Mass lesion	f	\N	\N	\N
1839	183	\N	8	Cerebral edema	f	\N	\N	\N
1840	183	\N	9	Other findings	t	Other findings	Enter other findings	\N
1841	184	\N	1	Not performed	f	\N	\N	\N
1842	184	\N	2	Performed	f	\N	\N	\N
1843	184	\N	3	Normal	f	\N	\N	\N
1844	184	\N	4	Pulmonary embolism	f	\N	\N	\N
1845	184	1844	1	Main pulmonary artery	f	\N	\N	\N
1846	184	1844	2	Lobar arteries	f	\N	\N	\N
1937	197	\N	6	LFTs normal	f	\N	\N	\N
1847	184	1844	3	Segmental arteries	f	\N	\N	\N
1848	184	1844	4	Subsegmental arteries	f	\N	\N	\N
1849	184	\N	5	Right ventricular strain	f	\N	\N	\N
1850	184	\N	6	Other findings	t	Other findings	Enter other findings	\N
1851	185	\N	1	Not performed	f	\N	\N	\N
1852	185	\N	2	Performed	f	\N	\N	\N
1853	185	\N	3	Normal	f	\N	\N	\N
1854	185	\N	4	Abdominal aortic aneurysm	f	\N	\N	\N
1855	185	\N	5	Aortic dissection	f	\N	\N	\N
1856	185	\N	6	Ruptured visceral organ	f	\N	\N	\N
1857	185	\N	7	Free fluid	f	\N	\N	\N
1858	185	\N	8	Bowel obstruction	f	\N	\N	\N
1859	185	\N	9	Other findings	t	Other findings	Enter other findings	\N
1860	186	\N	1	Not performed	f	\N	\N	\N
1861	186	\N	2	Performed	f	\N	\N	\N
1862	186	\N	3	Normal	f	\N	\N	\N
1863	186	\N	4	Aortic dissection	f	\N	\N	\N
1864	186	\N	5	Aortic aneurysm	f	\N	\N	\N
1865	186	\N	6	Other findings	t	Other findings	Enter other findings	\N
1866	187	\N	1	Not performed	f	\N	\N	\N
1867	187	\N	2	Performed	f	\N	\N	\N
1868	187	\N	3	Normal	f	\N	\N	\N
1869	187	\N	4	Acute ischemic stroke	f	\N	\N	\N
1870	187	\N	5	Chronic ischemic changes	f	\N	\N	\N
1871	187	\N	6	Intracranial hemorrhage	f	\N	\N	\N
1872	187	\N	7	Mass lesion	f	\N	\N	\N
1873	187	\N	8	Other findings	t	Other findings	Enter other findings	\N
1874	188	\N	1	Not performed	f	\N	\N	\N
1875	188	\N	2	Performed	f	\N	\N	\N
1876	188	\N	3	Normal vasculature	f	\N	\N	\N
1877	188	\N	4	Vascular stenosis	f	\N	\N	\N
1878	188	\N	5	Vascular occlusion	f	\N	\N	\N
1879	188	\N	6	Aneurysm	f	\N	\N	\N
1880	188	\N	7	Arteriovenous malformation	f	\N	\N	\N
1881	188	\N	8	Other findings	t	Other findings	Enter other findings	\N
1882	189	\N	1	Not performed	f	\N	\N	\N
1883	189	\N	2	Performed	f	\N	\N	\N
1884	189	\N	3	Normal	f	\N	\N	\N
1885	189	\N	4	Carotid stenosis (% stenosis	t	Carotid stenosis (% stenosis	Enter carotid stenosis (% stenosis	\N
1886	189	\N	5	Plaque formation	f	\N	\N	\N
1887	189	\N	6	Other findings	t	Other findings	Enter other findings	\N
1888	190	\N	1	Not performed	f	\N	\N	\N
1889	190	\N	2	Performed	f	\N	\N	\N
1890	190	\N	3	Normal	f	\N	\N	\N
1891	190	\N	4	Abdominal aortic aneurysm	f	\N	\N	\N
1892	190	\N	5	Free fluid	f	\N	\N	\N
1893	190	\N	6	Other findings	t	Other findings	Enter other findings	\N
1894	191	\N	1	Not performed	f	\N	\N	\N
1895	191	\N	2	Performed	f	\N	\N	\N
1896	191	\N	3	Normal	f	\N	\N	\N
1897	191	\N	4	Ectopic pregnancy	f	\N	\N	\N
1898	191	\N	5	Ovarian cyst/mass	f	\N	\N	\N
1899	191	\N	6	Free fluid	f	\N	\N	\N
1900	191	\N	7	Other findings	t	Other findings	Enter other findings	\N
1901	191	\N	8	Not applicable	f	\N	\N	\N
1902	192	\N	1	Hemoglobin	t	Hemoglobin	Enter hemoglobin	\N
1903	192	\N	2	Hematocrit	t	Hematocrit	Enter hematocrit	note if <30%
1904	192	\N	3	White blood cell count	t	White blood cell count	Enter white blood cell count	\N
1905	192	\N	4	Platelet count	t	Platelet count	Enter platelet count	\N
1906	192	\N	5	CBC normal	f	\N	\N	\N
1907	192	\N	6	CBC abnormal	t	CBC abnormal	Enter cbc abnormal	\N
1908	193	\N	1	Sodium	t	Sodium	Enter sodium	\N
1909	193	\N	2	Potassium	t	Potassium	Enter potassium	\N
1910	193	\N	3	Chloride	t	Chloride	Enter chloride	\N
1911	193	\N	4	Bicarbonate	t	Bicarbonate	Enter bicarbonate	\N
1912	193	\N	5	BUN	t	BUN	Enter bun	\N
1913	193	\N	6	Creatinine	t	Creatinine	Enter creatinine	\N
1914	193	\N	7	Glucose	t	Glucose	Enter glucose	\N
1915	193	\N	8	Calcium	t	Calcium	Enter calcium	\N
1916	193	\N	9	BMP normal	f	\N	\N	\N
1917	193	\N	10	BMP abnormal	t	BMP abnormal	Enter bmp abnormal	\N
1918	194	\N	1	Troponin	t	Troponin	Enter troponin	elevated if >99th percentile
1919	194	\N	2	High-sensitivity troponin T	t	High-sensitivity troponin T	Enter high-sensitivity troponin t	elevated if >19 ng/L
1920	194	\N	3	NT-proBNP	t	NT-proBNP	Enter nt-probnp	elevated if >125 pg/mL
1921	194	\N	4	BNP	t	BNP	Enter bnp	\N
1922	194	\N	5	CK-MB	t	CK-MB	Enter ck-mb	\N
1923	194	\N	6	Cardiac biomarkers normal	f	\N	\N	\N
1924	194	\N	7	Cardiac biomarkers elevated	f	\N	\N	\N
1925	195	\N	1	INR	t	INR	Enter inr	\N
1926	195	\N	2	PTT	t	PTT	Enter ptt	\N
1927	195	\N	3	D-dimer	t	D-dimer	Enter d-dimer	\N
1928	195	\N	4	Coagulation studies normal	f	\N	\N	\N
1929	195	\N	5	Coagulation studies abnormal	t	Coagulation studies abnormal	Enter coagulation studies abnormal	\N
1930	196	\N	1	Magnesium	t	Magnesium	Enter magnesium	\N
1931	196	\N	2	Phosphorus	t	Phosphorus	Enter phosphorus	\N
1932	197	\N	1	AST	t	AST	Enter ast	\N
1933	197	\N	2	ALT	t	ALT	Enter alt	\N
1934	197	\N	3	Alkaline phosphatase	t	Alkaline phosphatase	Enter alkaline phosphatase	\N
1935	197	\N	4	Total bilirubin	t	Total bilirubin	Enter total bilirubin	\N
1936	197	\N	5	Albumin	t	Albumin	Enter albumin	\N
1938	197	\N	7	LFTs abnormal	t	LFTs abnormal	Enter lfts abnormal	\N
1939	198	\N	1	Blood alcohol level	t	Blood alcohol level	Enter blood alcohol level	\N
1940	198	\N	2	Urine drug screen	t	Urine drug screen	Enter urine drug screen	\N
1941	198	\N	3	Toxicology screen negative	f	\N	\N	\N
1942	198	\N	4	Toxicology screen positive	t	Toxicology screen positive	Enter toxicology screen positive	\N
1943	199	\N	1	Urine hCG	t	Urine hCG	Enter urine hcg	\N
1944	199	\N	2	Serum hCG	t	Serum hCG	Enter serum hcg	\N
1945	199	\N	3	Not applicable	f	\N	\N	\N
1946	200	\N	1	TSH	t	TSH	Enter tsh	\N
1947	200	\N	2	Free T4	t	Free T4	Enter free t4	\N
1948	200	\N	3	Thyroid function normal	f	\N	\N	\N
1949	200	\N	4	Thyroid function abnormal	t	Thyroid function abnormal	Enter thyroid function abnormal	\N
1950	201	\N	1	pH	t	pH	Enter ph	\N
1951	201	\N	2	PaCO2	t	PaCO2	Enter paco2	\N
1952	201	\N	3	PaO2	t	PaO2	Enter pao2	\N
1953	201	\N	4	HCO3	t	HCO3	Enter hco3	\N
1954	201	\N	5	Base excess	t	Base excess	Enter base excess	\N
1955	201	\N	6	Lactate	t	Lactate	Enter lactate	\N
1956	201	\N	7	ABG normal	f	\N	\N	\N
1957	201	\N	8	ABG abnormal	t	ABG abnormal	Enter abg abnormal	\N
1958	202	\N	1	Specific gravity	t	Specific gravity	Enter specific gravity	\N
1959	202	\N	2	pH	t	pH	Enter ph	\N
1960	202	\N	3	Protein	t	Protein	Enter protein	\N
1961	202	\N	4	Glucose	t	Glucose	Enter glucose	\N
1962	202	\N	5	Ketones	t	Ketones	Enter ketones	\N
1963	202	\N	6	Blood	t	Blood	Enter blood	\N
1964	202	\N	7	Leukocyte esterase	t	Leukocyte esterase	Enter leukocyte esterase	\N
1965	202	\N	8	Nitrites	t	Nitrites	Enter nitrites	\N
1966	202	\N	9	Urinalysis normal	f	\N	\N	\N
1967	202	\N	10	Urinalysis abnormal	t	Urinalysis abnormal	Enter urinalysis abnormal	\N
1968	203	\N	1	Cortisol level	t	Cortisol level	Enter cortisol level	\N
1969	203	\N	2	Ammonia level	t	Ammonia level	Enter ammonia level	\N
1970	203	\N	3	Lactic acid	t	Lactic acid	Enter lactic acid	\N
1971	203	\N	4	Other	t	Other	Enter other	\N
1972	204	\N	1	Definition and explanation of syncope	f	\N	\N	\N
1973	204	\N	2	Common causes of syncope	f	\N	\N	\N
1974	204	\N	3	Difference between syncope and seizure	f	\N	\N	\N
1975	204	\N	4	Expected natural course	f	\N	\N	\N
1976	204	\N	5	Warning signs and symptoms	f	\N	\N	\N
1977	204	\N	6	When to seek immediate medical attention	f	\N	\N	\N
1978	205	\N	1	Risk of recurrence	f	\N	\N	\N
1979	205	\N	2	Injury prevention strategies	f	\N	\N	\N
1980	205	\N	3	Fall precautions	f	\N	\N	\N
1981	205	\N	4	Home safety modifications	f	\N	\N	\N
1982	205	\N	5	Driving restrictions	f	\N	\N	\N
1983	205	\N	6	Occupational restrictions	f	\N	\N	\N
1984	205	\N	7	Activity modifications	f	\N	\N	\N
1985	205	\N	8	Medical alert device recommendations	f	\N	\N	\N
1986	206	\N	1	Vasovagal syncope	f	\N	\N	\N
1987	206	\N	2	Orthostatic hypotension	f	\N	\N	\N
1988	206	\N	3	Cardiac arrhythmia	f	\N	\N	\N
1989	206	\N	4	Structural heart disease	f	\N	\N	\N
1990	206	\N	5	Situational syncope	f	\N	\N	\N
1991	206	\N	6	Medication-related syncope	f	\N	\N	\N
1992	206	\N	7	Other specific cause	t	Other specific cause	Enter other specific cause	\N
1993	207	\N	1	Early warning signs identification	f	\N	\N	\N
1994	207	\N	2	Time course of prodromal symptoms	f	\N	\N	\N
1995	207	\N	3	Physical countermeasures training	f	\N	\N	\N
1996	207	\N	4	Lying down when symptoms occur	f	\N	\N	\N
1997	207	\N	5	Sitting with head between knees	f	\N	\N	\N
1998	208	\N	1	Leg crossing with muscle tensing	f	\N	\N	\N
1999	208	\N	2	Hand gripping	f	\N	\N	\N
2000	208	\N	3	Arm tensing	f	\N	\N	\N
2001	208	\N	4	Squatting	f	\N	\N	\N
2002	208	\N	5	When and how to perform maneuvers	f	\N	\N	\N
2003	209	\N	1	Adequate hydration (specific fluid intake goals)	f	\N	\N	\N
2004	209	\N	2	Increased salt intake (if appropriate)	f	\N	\N	\N
2005	209	\N	3	Proper body mechanics when changing positions	f	\N	\N	\N
2006	209	\N	4	Slow position changes	f	\N	\N	\N
2007	209	\N	5	Compression stockings usage	f	\N	\N	\N
2008	209	\N	6	Avoiding triggering situations	f	\N	\N	\N
2009	209	\N	7	Sleeping with head elevated	f	\N	\N	\N
2010	209	\N	8	Moderate exercise program	f	\N	\N	\N
2011	210	\N	1	Purpose of medications	f	\N	\N	\N
2012	210	\N	2	Proper administration	f	\N	\N	\N
2013	210	\N	3	Side effects to watch for	f	\N	\N	\N
2014	210	\N	4	Potential interactions	f	\N	\N	\N
2015	210	\N	5	Medications that may worsen syncope	f	\N	\N	\N
2016	210	\N	6	Importance of medication compliance	f	\N	\N	\N
2017	211	\N	1	Importance of follow-up appointments	f	\N	\N	\N
2018	211	\N	2	Specific follow-up instructions	f	\N	\N	\N
2019	211	\N	3	Specialists to be seen	f	\N	\N	\N
2020	211	\N	4	Timeframe for follow-up	f	\N	\N	\N
2021	211	\N	5	Additional testing to be completed	f	\N	\N	\N
2022	211	\N	6	How to prepare for follow-up visits	f	\N	\N	\N
2023	211	\N	7	When to seek emergency care	f	\N	\N	\N
2024	212	\N	1	Chest pain	f	\N	\N	\N
2025	212	\N	2	Shortness of breath	f	\N	\N	\N
2026	212	\N	3	Severe headache	f	\N	\N	\N
2027	212	\N	4	Prolonged confusion	f	\N	\N	\N
2028	212	\N	5	Injury from syncope/fall	f	\N	\N	\N
2029	212	\N	6	Multiple episodes in short timeframe	f	\N	\N	\N
2030	212	\N	7	Syncope during exertion	f	\N	\N	\N
2031	212	\N	8	Syncope without warning	f	\N	\N	\N
2032	213	\N	1	What to do if witnessing a syncopal episode	f	\N	\N	\N
2033	213	\N	2	When to call emergency services	f	\N	\N	\N
2034	213	\N	3	Basic first aid	f	\N	\N	\N
2035	213	\N	4	Documentation of episodes	f	\N	\N	\N
2036	213	\N	5	Support for patient compliance	f	\N	\N	\N
2037	213	\N	6	Recognition of warning signs	f	\N	\N	\N
2038	214	\N	1	Blood pressure	t	Blood pressure	Enter blood pressure	\N
2039	214	\N	2	Heart rate	t	Heart rate	Enter heart rate	\N
2040	214	\N	3	Respiratory rate	t	Respiratory rate	Enter respiratory rate	\N
2041	214	\N	4	Temperature	t	Temperature	Enter temperature	\N
2042	214	\N	5	Oxygen saturation	t	Oxygen saturation	Enter oxygen saturation	\N
2043	214	\N	6	Body mass index	t	Body mass index	Enter body mass index	\N
2044	215	\N	1	Supine BP	t	Supine BP	Enter supine bp	\N
2045	215	\N	2	Sitting BP	t	Sitting BP	Enter sitting bp	\N
2046	215	\N	3	Standing BP	t	Standing BP	Enter standing bp	\N
2047	215	\N	4	Drop in systolic BP ≥20 mmHg	f	\N	\N	\N
2048	215	\N	5	Drop in diastolic BP ≥10 mmHg	f	\N	\N	\N
2049	215	\N	6	Symptoms reproduced with position change	f	\N	\N	\N
2050	215	\N	7	No significant orthostatic changes	f	\N	\N	\N
2051	216	\N	1	Well-appearing	f	\N	\N	\N
2052	216	\N	2	Ill-appearing	f	\N	\N	\N
2053	216	\N	3	Pale	f	\N	\N	\N
2054	216	\N	4	Diaphoretic	f	\N	\N	\N
2055	216	\N	5	Cyanotic	f	\N	\N	\N
2056	216	\N	6	Distressed	f	\N	\N	\N
2057	217	\N	1	Head trauma evident	f	\N	\N	\N
2058	217	\N	2	Facial trauma evident	f	\N	\N	\N
2059	217	\N	3	Pupils equal and reactive	f	\N	\N	\N
2060	217	\N	4	Extraocular movements intact	f	\N	\N	\N
2061	217	\N	5	Fundoscopic exam normal	f	\N	\N	\N
2062	217	\N	6	Oropharynx clear	f	\N	\N	\N
2063	217	\N	7	Tongue laceration present	f	\N	\N	\N
2064	217	\N	8	Moist mucous membranes	f	\N	\N	\N
2065	217	\N	9	Dry mucous membranes	f	\N	\N	\N
2066	218	\N	1	Regular rate and rhythm	f	\N	\N	\N
2067	218	\N	2	Irregular rhythm	f	\N	\N	\N
2068	218	\N	3	Tachycardia	f	\N	\N	\N
2069	218	\N	4	Bradycardia	f	\N	\N	\N
2070	218	\N	5	Normal S1, S2	f	\N	\N	\N
2071	218	\N	6	S3 gallop present	f	\N	\N	\N
2072	218	\N	7	S4 gallop present	f	\N	\N	\N
2073	218	\N	8	Systolic murmur	f	\N	\N	\N
2074	218	2073	1	Location	t	Location	Enter location	\N
2075	218	2073	2	Grade: ___/6	f	\N	\N	\N
2076	218	2073	3	Radiation	t	Radiation	Enter radiation	\N
2077	218	\N	9	Diastolic murmur	f	\N	\N	\N
2078	218	\N	10	Carotid bruits	f	\N	\N	\N
2079	218	\N	11	Jugular venous distention	f	\N	\N	\N
2080	218	\N	12	Carotid sinus massage performed (results	t	Carotid sinus massage performed (results	Enter carotid sinus massage performed (results	\N
2081	218	\N	13	Peripheral pulses normal	f	\N	\N	\N
2082	218	\N	14	Pulse deficit	f	\N	\N	\N
2083	218	\N	15	Capillary refill <3 seconds	f	\N	\N	\N
2084	218	\N	16	Capillary refill >3 seconds	f	\N	\N	\N
2085	219	\N	1	Clear to auscultation bilaterally	f	\N	\N	\N
2086	219	\N	2	Wheezes	f	\N	\N	\N
2087	219	\N	3	Rales/crackles	f	\N	\N	\N
2088	219	\N	4	Rhonchi	f	\N	\N	\N
2089	219	\N	5	Decreased breath sounds	f	\N	\N	\N
2090	219	\N	6	Respiratory distress	f	\N	\N	\N
2091	219	\N	7	Accessory muscle use	f	\N	\N	\N
2092	220	\N	1	Soft	f	\N	\N	\N
2093	220	\N	2	Non-tender	f	\N	\N	\N
2094	220	\N	3	Tender (location	t	Tender (location	Enter tender (location	\N
2095	220	\N	4	Distended	f	\N	\N	\N
2096	220	\N	5	Rigid	f	\N	\N	\N
2097	220	\N	6	Guarding	f	\N	\N	\N
2098	220	\N	7	Rebound tenderness	f	\N	\N	\N
2099	220	\N	8	Bowel sounds normal	f	\N	\N	\N
2100	220	\N	9	Bowel sounds hypoactive/hyperactive	f	\N	\N	\N
2101	220	\N	10	Abdominal bruit present	f	\N	\N	\N
2102	220	\N	11	Pulsatile mass	f	\N	\N	\N
2103	220	\N	12	Organomegaly	f	\N	\N	\N
2104	221	\N	1	Alert and oriented (x_____)	f	\N	\N	\N
2105	221	\N	2	Confused	f	\N	\N	\N
2106	221	\N	3	Altered mental status	f	\N	\N	\N
2107	221	\N	4	Normal speech	f	\N	\N	\N
2108	221	\N	5	Dysarthria	f	\N	\N	\N
2109	221	\N	6	Aphasia	f	\N	\N	\N
2110	221	\N	7	Cranial nerves II-XII intact	f	\N	\N	\N
2111	221	\N	8	Cranial nerve deficit	t	Cranial nerve deficit	Enter cranial nerve deficit	\N
2112	221	\N	9	Motor strength 5/5 all extremities	f	\N	\N	\N
2113	221	\N	10	Motor deficit	t	Motor deficit	Enter motor deficit	\N
2114	221	\N	11	Sensory exam normal	f	\N	\N	\N
2115	221	\N	12	Sensory deficit	t	Sensory deficit	Enter sensory deficit	\N
2116	221	\N	13	Reflexes normal and symmetric	f	\N	\N	\N
2117	221	\N	14	Abnormal reflexes	t	Abnormal reflexes	Enter abnormal reflexes	\N
2118	221	\N	15	Coordination normal	f	\N	\N	\N
2119	221	\N	16	Coordination abnormal	t	Coordination abnormal	Enter coordination abnormal	\N
2120	221	\N	17	Gait normal	f	\N	\N	\N
2121	221	\N	18	Gait abnormal	t	Gait abnormal	Enter gait abnormal	\N
2122	221	\N	19	Romberg test negative	f	\N	\N	\N
2123	221	\N	20	Romberg test positive	f	\N	\N	\N
2124	222	\N	1	No edema	f	\N	\N	\N
2125	222	\N	2	Peripheral edema (location/severity	t	Peripheral edema (location/severity	Enter peripheral edema (location/severity	\N
2126	222	\N	3	No cyanosis	f	\N	\N	\N
2127	222	\N	4	Cyanosis present	f	\N	\N	\N
2128	222	\N	5	No clubbing	f	\N	\N	\N
2129	222	\N	6	Clubbing present	f	\N	\N	\N
2130	222	\N	7	Evidence of trauma from fall	f	\N	\N	\N
2131	223	\N	1	Normal	f	\N	\N	\N
2132	223	\N	2	Diaphoretic	f	\N	\N	\N
2133	223	\N	3	Pale	f	\N	\N	\N
2134	223	\N	4	Flushed	f	\N	\N	\N
2135	223	\N	5	Petechiae	f	\N	\N	\N
2136	223	\N	6	Purpura	f	\N	\N	\N
2137	223	\N	7	Laceration/Abrasion (location	t	Laceration/Abrasion (location	Enter laceration/abrasion (location	\N
2138	223	\N	8	Hematoma (location	t	Hematoma (location	Enter hematoma (location	\N
2139	224	\N	1	Normal	f	\N	\N	\N
2140	224	\N	2	Melena present	f	\N	\N	\N
2141	224	\N	3	Bright red blood per rectum	f	\N	\N	\N
2142	225	\N	1	Cardiac monitoring	f	\N	\N	\N
2143	225	\N	2	IV access established	f	\N	\N	\N
2144	225	\N	3	Fluid resuscitation	f	\N	\N	\N
2145	225	\N	4	Supplemental oxygen	f	\N	\N	\N
2146	225	\N	5	Medication administration	t	Medication administration	Enter medication administration	\N
2147	225	\N	6	Pacemaker/defibrillator interrogation	f	\N	\N	\N
2148	225	\N	7	Emergent cardiology consultation	f	\N	\N	\N
2149	225	\N	8	Emergent neurology consultation	f	\N	\N	\N
2150	225	\N	9	Emergent surgical consultation	f	\N	\N	\N
2151	226	\N	1	Repeat ECG	f	\N	\N	\N
2152	226	\N	2	Continuous cardiac monitoring	f	\N	\N	\N
2153	226	\N	3	Serial cardiac biomarkers	f	\N	\N	\N
2154	226	\N	4	Complete echocardiogram	f	\N	\N	\N
2155	226	\N	5	Exercise stress test	f	\N	\N	\N
2156	226	\N	6	Nuclear stress test	f	\N	\N	\N
2157	226	\N	7	Ambulatory cardiac monitoring (specify type and duration	t	Ambulatory cardiac monitoring (specify type and duration	Enter ambulatory cardiac monitoring (specify type and duration	\N
2158	226	\N	8	Tilt-table testing	f	\N	\N	\N
2159	226	\N	9	Carotid sinus massage (if not performed in ED)	f	\N	\N	\N
2160	226	\N	10	Electrophysiology study	f	\N	\N	\N
2161	226	\N	11	Additional laboratory tests	t	Additional laboratory tests	Enter additional laboratory tests	\N
2162	226	\N	12	Additional imaging	t	Additional imaging	Enter additional imaging	\N
2163	227	\N	1	Continue current medications	f	\N	\N	\N
2164	227	\N	2	Discontinue medication(s)	t	Discontinue medication(s)	Enter discontinue medication(s)	\N
2165	227	\N	3	Reduce dosage of medication(s)	t	Reduce dosage of medication(s)	Enter reduce dosage of medication(s)	\N
2166	227	\N	4	New medication(s)	t	New medication(s)	Enter new medication(s)	\N
2167	227	\N	5	Adjust timing of medication administration	f	\N	\N	\N
2168	227	\N	6	Address polypharmacy	f	\N	\N	\N
2169	228	\N	1	Increase fluid intake	f	\N	\N	\N
2170	228	\N	2	Increase salt intake	f	\N	\N	\N
2171	228	\N	3	Physical counter-pressure maneuvers	f	\N	\N	\N
2172	228	\N	4	Compression stockings	f	\N	\N	\N
2173	228	\N	5	Avoid triggers	f	\N	\N	\N
2174	228	\N	6	Dietary modifications	f	\N	\N	\N
2175	228	\N	7	Alcohol limitation/cessation	f	\N	\N	\N
2176	228	\N	8	Sleeping with head of bed elevated	f	\N	\N	\N
2177	229	\N	1	Pacemaker implantation	f	\N	\N	\N
2178	229	\N	2	Implantable cardioverter-defibrillator	f	\N	\N	\N
2179	229	\N	3	Cardiac ablation procedure	f	\N	\N	\N
2180	229	\N	4	Cardiac surgery	f	\N	\N	\N
2181	229	\N	5	Coronary angiography	f	\N	\N	\N
2182	229	\N	6	Valvular intervention	f	\N	\N	\N
2183	230	\N	1	Primary care follow-up (timeframe	t	Primary care follow-up (timeframe	Enter primary care follow-up (timeframe	\N
2184	230	\N	2	Cardiology follow-up (timeframe	t	Cardiology follow-up (timeframe	Enter cardiology follow-up (timeframe	\N
2185	230	\N	3	Neurology follow-up (timeframe	t	Neurology follow-up (timeframe	Enter neurology follow-up (timeframe	\N
2186	230	\N	4	Electrophysiology follow-up (timeframe	t	Electrophysiology follow-up (timeframe	Enter electrophysiology follow-up (timeframe	\N
2187	230	\N	5	Other specialist follow-up	t	Other specialist follow-up	Enter other specialist follow-up	\N
2188	230	\N	6	Outpatient cardiac monitoring	f	\N	\N	\N
2189	230	\N	7	Outpatient diagnostic testing	f	\N	\N	\N
2190	230	\N	8	Home health services	f	\N	\N	\N
2191	230	\N	9	Fall risk assessment	f	\N	\N	\N
2192	230	\N	10	Home safety evaluation	f	\N	\N	\N
2193	231	\N	1	Fall precautions	f	\N	\N	\N
2194	231	\N	2	Medical alert device	f	\N	\N	\N
2195	231	\N	3	Driving restrictions/counseling	f	\N	\N	\N
2196	231	\N	4	Occupational restrictions/counseling	f	\N	\N	\N
2197	231	\N	5	Avoidance of high-risk activities	f	\N	\N	\N
2198	231	\N	6	Home safety modifications	f	\N	\N	\N
2199	231	\N	7	Physical therapy referral	f	\N	\N	\N
2200	232	\N	1	Pregnancy considerations	f	\N	\N	\N
2201	232	\N	2	Elderly patient considerations	f	\N	\N	\N
2202	232	\N	3	Cognitive impairment considerations	f	\N	\N	\N
2203	232	\N	4	Multidisciplinary team approach	f	\N	\N	\N
2204	232	\N	5	Palliative care consultation	f	\N	\N	\N
2205	233	\N	1	Age > 60 years	f	\N	\N	\N
2206	233	\N	2	Male gender	f	\N	\N	\N
2207	233	\N	3	Bimodal age distribution (peak at age 20, peak after age 60)	f	\N	\N	\N
2208	234	\N	1	Known heart disease	f	\N	\N	\N
2209	234	\N	2	Previous myocardial infarction	f	\N	\N	\N
2210	234	\N	3	Family history of sudden cardiac death (< 50 years)	f	\N	\N	\N
2211	234	\N	4	Family history of cardiac arrhythmia	f	\N	\N	\N
2212	234	\N	5	Family history of early CAD	f	\N	\N	\N
2213	234	\N	6	History of congestive heart failure	f	\N	\N	\N
2214	234	\N	7	Known arrhythmia	f	\N	\N	\N
2215	234	\N	8	Implanted cardiac device (pacemaker/ICD/VAD)	f	\N	\N	\N
2216	234	\N	9	Structural heart disease	f	\N	\N	\N
2217	234	\N	10	Valvular heart disease	f	\N	\N	\N
2218	234	\N	11	Congenital heart disease	f	\N	\N	\N
2219	234	\N	12	Atrial fibrillation	f	\N	\N	\N
2220	234	\N	13	Previous abnormal ECG	f	\N	\N	\N
2221	234	\N	14	History of cardiomyopathy	f	\N	\N	\N
2222	234	\N	15	Cardiac channelopathy (Brugada, Long QT)	f	\N	\N	\N
2223	235	\N	1	Hypertension	f	\N	\N	\N
2224	235	\N	2	Hyperlipidemia	f	\N	\N	\N
2225	235	\N	3	Diabetes mellitus	f	\N	\N	\N
2226	235	\N	4	Smoking	f	\N	\N	\N
2227	235	\N	5	Sedentary lifestyle	f	\N	\N	\N
2228	235	\N	6	Family history of aortic dissection/aneurysm	f	\N	\N	\N
2229	235	\N	7	Known aortic aneurysm	f	\N	\N	\N
2230	235	\N	8	Peripheral vascular disease	f	\N	\N	\N
2231	235	\N	9	History of previous stroke/TIA	f	\N	\N	\N
2232	236	\N	1	Prolonged immobility	f	\N	\N	\N
2233	236	\N	2	Recent surgery	f	\N	\N	\N
2234	236	\N	3	History of deep vein thrombosis	f	\N	\N	\N
2235	236	\N	4	History of pulmonary embolism	f	\N	\N	\N
2236	236	\N	5	Active cancer	f	\N	\N	\N
2237	236	\N	6	Pregnancy or postpartum state	f	\N	\N	\N
2238	236	\N	7	Oral contraceptive use	f	\N	\N	\N
2239	236	\N	8	Known hypercoagulable state	f	\N	\N	\N
2240	236	\N	9	Obesity	f	\N	\N	\N
2241	236	\N	10	Long-distance travel	f	\N	\N	\N
2242	237	\N	1	Dehydration	f	\N	\N	\N
2243	237	\N	2	Blood loss/anemia	f	\N	\N	\N
2244	237	\N	3	Autonomic dysfunction	f	\N	\N	\N
2245	237	\N	4	Advanced age	f	\N	\N	\N
2246	237	\N	5	Medications (see Medication section)	f	\N	\N	\N
2247	237	\N	6	Alcohol consumption	f	\N	\N	\N
2248	237	\N	7	Prolonged bedrest	f	\N	\N	\N
2249	238	\N	1	Predisposition to vasovagal syncope (-1 point)	f	\N	\N	\N
2250	238	\N	2	History of heart disease (+1 point)	f	\N	\N	\N
2251	238	\N	3	Systolic BP <90 or >180 mmHg (+2 points)	f	\N	\N	\N
2252	238	\N	4	Elevated troponin (+2 points)	f	\N	\N	\N
2253	238	\N	5	Abnormal QRS axis (+1 point)	f	\N	\N	\N
2254	238	\N	6	QRS >130 ms (+1 point)	f	\N	\N	\N
2255	238	\N	7	QTc >480 ms (+2 points)	f	\N	\N	\N
2256	238	\N	8	ED diagnosis of vasovagal syncope (-2 points)	f	\N	\N	\N
2257	238	\N	9	ED diagnosis of cardiac syncope (+2 points)	f	\N	\N	\N
2258	239	\N	1	History of CHF	f	\N	\N	\N
2259	239	\N	2	Hematocrit <30%	f	\N	\N	\N
2260	239	\N	3	Abnormal ECG	f	\N	\N	\N
2261	239	\N	4	Shortness of breath	f	\N	\N	\N
2262	239	\N	5	Systolic BP <90 mmHg	f	\N	\N	\N
2263	240	\N	1	History of heart failure (+1 point)	f	\N	\N	\N
2264	240	\N	2	History of cardiac arrhythmia (+1 point)	f	\N	\N	\N
2265	240	\N	3	Abnormal ECG (+1 point)	f	\N	\N	\N
2266	240	\N	4	Elevated NT-proBNP >125 pg/mL (+2 points)	f	\N	\N	\N
2267	240	\N	5	Elevated troponin T >19 ng/L (+1 point)	f	\N	\N	\N
2268	241	\N	1	Bedside cardiac ultrasound	f	\N	\N	\N
2269	241	2268	1	Normal cardiac function	f	\N	\N	\N
2270	241	2268	2	Reduced ejection fraction	f	\N	\N	\N
2271	241	2268	3	Right ventricular strain	f	\N	\N	\N
2272	241	2268	4	Pericardial effusion	f	\N	\N	\N
2273	241	2268	5	Cardiac tamponade	f	\N	\N	\N
2274	241	2268	6	Valvular abnormality	f	\N	\N	\N
2275	241	2268	7	Wall motion abnormality	f	\N	\N	\N
2276	241	2268	8	Other findings	t	Other findings	Enter other findings	\N
2277	241	\N	2	Bedside abdominal aorta ultrasound	f	\N	\N	\N
2278	241	2277	1	Normal aorta	f	\N	\N	\N
2279	241	2277	2	Aortic aneurysm (size	t	Aortic aneurysm (size	Enter aortic aneurysm (size	\N
2280	241	2277	3	Aortic dissection	f	\N	\N	\N
2281	241	2277	4	Other findings	t	Other findings	Enter other findings	\N
2282	241	\N	3	Bedside IVC ultrasound	f	\N	\N	\N
2283	241	2282	1	Normal IVC diameter and respiratory variation	f	\N	\N	\N
2284	241	2282	2	Flat IVC (hypovolemia)	f	\N	\N	\N
2285	241	2282	3	Distended IVC with minimal respiratory variation (volume overload)	f	\N	\N	\N
2286	241	2282	4	Other findings	t	Other findings	Enter other findings	\N
2287	242	\N	1	Not performed	f	\N	\N	\N
2288	242	\N	2	Performed	f	\N	\N	\N
2289	242	2288	1	Baseline BP	t	Baseline BP	Enter baseline bp	\N
2290	242	2288	2	Highest BP	t	Highest BP	Enter highest bp	\N
2291	242	2288	3	Lowest BP	t	Lowest BP	Enter lowest bp	\N
2292	242	2288	4	Time to symptoms	t	Time to symptoms	Enter time to symptoms	\N
2293	242	2288	5	Symptoms reproduced	t	Symptoms reproduced	Enter symptoms reproduced	\N
2294	242	2288	6	Positive for vasovagal syncope	f	\N	\N	\N
2295	242	2288	7	Positive for orthostatic hypotension	f	\N	\N	\N
2296	242	2288	8	Negative study	f	\N	\N	\N
2297	242	2288	9	Other findings	t	Other findings	Enter other findings	\N
2298	243	\N	1	Not performed	f	\N	\N	\N
2299	243	\N	2	Performed	f	\N	\N	\N
2300	243	2299	1	Baseline BP	t	Baseline BP	Enter baseline bp	\N
2301	243	2299	2	Right side BP	t	Right side BP	Enter right side bp	\N
2302	243	2299	3	Left side BP	t	Left side BP	Enter left side bp	\N
2303	243	2299	4	Symptoms reproduced	t	Symptoms reproduced	Enter symptoms reproduced	\N
2304	243	2299	5	Positive for carotid sinus hypersensitivity (≥3 second pause and/or ≥50 mmHg decrease in SBP)	f	\N	\N	\N
2305	243	2299	6	Negative study	f	\N	\N	\N
2306	243	2299	7	Other findings	t	Other findings	Enter other findings	\N
2307	244	\N	1	Not performed	f	\N	\N	\N
2308	244	\N	2	Performed	f	\N	\N	\N
2309	244	2308	1	Exercise stress test	f	\N	\N	\N
2310	244	2308	2	Pharmacological stress test	f	\N	\N	\N
2311	244	2308	3	Nuclear stress test	f	\N	\N	\N
2312	244	2308	4	Stress echocardiogram	f	\N	\N	\N
2313	244	2308	5	Normal	f	\N	\N	\N
2314	244	2308	6	Ischemic changes	f	\N	\N	\N
2315	244	2308	7	Arrhythmia induced	f	\N	\N	\N
2316	244	2308	8	Symptoms reproduced	f	\N	\N	\N
2317	244	2308	9	Other findings	t	Other findings	Enter other findings	\N
2318	245	\N	1	Not performed	f	\N	\N	\N
2319	245	\N	2	Performed	f	\N	\N	\N
2320	245	2319	1	Type of monitor	t	Type of monitor	Enter type of monitor	\N
2321	245	2319	2	Duration of monitoring	t	Duration of monitoring	Enter duration of monitoring	\N
2322	245	2319	3	Normal sinus rhythm throughout	f	\N	\N	\N
2323	245	2319	4	Sinus bradycardia	f	\N	\N	\N
2324	245	2319	5	Sinus tachycardia	f	\N	\N	\N
2325	245	2319	6	Atrial fibrillation/flutter	f	\N	\N	\N
2326	245	2319	7	Supraventricular tachycardia	f	\N	\N	\N
2327	245	2319	8	Ventricular tachycardia	f	\N	\N	\N
2328	245	2319	9	AV block	f	\N	\N	\N
2329	245	2319	10	Sinus pauses (max duration	t	Sinus pauses (max duration	Enter sinus pauses (max duration	\N
2330	245	2319	11	Symptoms correlated with rhythm	t	Symptoms correlated with rhythm	Enter symptoms correlated with rhythm	\N
2331	245	2319	12	Other findings	t	Other findings	Enter other findings	\N
2332	246	\N	1	Not performed	f	\N	\N	\N
2333	246	\N	2	Performed	f	\N	\N	\N
2334	246	2333	1	Normal	f	\N	\N	\N
2335	246	2333	2	Epileptiform activity	f	\N	\N	\N
2336	246	2333	3	Focal slowing	f	\N	\N	\N
2337	246	2333	4	Generalized slowing	f	\N	\N	\N
2338	246	2333	5	Other findings	t	Other findings	Enter other findings	\N
2339	247	\N	1	Not performed	f	\N	\N	\N
2340	247	\N	2	Performed	f	\N	\N	\N
2341	247	2340	1	Normal coronary arteries	f	\N	\N	\N
2342	247	2340	2	Coronary artery disease (vessels involved	t	Coronary artery disease (vessels involved	Enter coronary artery disease (vessels involved	\N
2343	247	2340	3	Percent stenosis	t	Percent stenosis	Enter percent stenosis	\N
2344	247	2340	4	Valvular disease	f	\N	\N	\N
2345	247	2340	5	Other findings	t	Other findings	Enter other findings	\N
2346	248	\N	1	Not performed	f	\N	\N	\N
2347	248	\N	2	Performed	f	\N	\N	\N
2348	248	2347	1	Normal	f	\N	\N	\N
2349	248	2347	2	Inducible arrhythmia	t	Inducible arrhythmia	Enter inducible arrhythmia	\N
2350	248	2347	3	Conduction abnormality	t	Conduction abnormality	Enter conduction abnormality	\N
2351	248	2347	4	Other findings	t	Other findings	Enter other findings	\N
2352	249	\N	1	Sudden onset of worst headache of life (subarachnoid hemorrhage)	f	\N	\N	\N
2353	249	\N	2	Rapidly decreasing level of consciousness (GCS drop ≥2 points)	f	\N	\N	\N
2354	249	\N	3	Pinpoint pupils unresponsive to light (pontine lesion or opioid toxicity)	f	\N	\N	\N
2355	249	\N	4	Fixed, dilated pupils (herniation, severe midbrain injury)	f	\N	\N	\N
2356	249	\N	5	Asymmetric pupils (uncal herniation)	f	\N	\N	\N
2357	249	\N	6	Cushing's triad (hypertension, bradycardia, irregular respirations)	f	\N	\N	\N
2358	249	\N	7	Decerebrate or decorticate posturing (severe brain injury)	f	\N	\N	\N
2359	249	\N	8	Nonreactive, midsize pupils (midbrain injury or early brain death)	f	\N	\N	\N
2360	249	\N	9	Forced eye deviation (hemispheric or pontine lesion)	f	\N	\N	\N
2361	249	\N	10	Absent brainstem reflexes (brainstem dysfunction)	f	\N	\N	\N
2362	249	\N	11	Skew deviation (cerebellar or brainstem lesion)	f	\N	\N	\N
2363	249	\N	12	Battle's sign or raccoon eyes (basilar skull fracture)	f	\N	\N	\N
2364	249	\N	13	CSF otorrhea or rhinorrhea (basilar skull fracture)	f	\N	\N	\N
2365	249	\N	14	Papilledema (increased intracranial pressure)	f	\N	\N	\N
2366	250	\N	1	Hypertension (SBP >180 mmHg)	f	\N	\N	\N
2367	250	\N	2	Hypotension (SBP <90 mmHg)	f	\N	\N	\N
2368	250	\N	3	Bradycardia (HR <50 bpm)	f	\N	\N	\N
2369	250	\N	4	Tachycardia (HR >100 bpm)	f	\N	\N	\N
2370	250	\N	5	Hyperthermia (T >38.5°C)	f	\N	\N	\N
2371	250	\N	6	Hypothermia (T <35°C)	f	\N	\N	\N
2372	250	\N	7	Tachypnea (RR >20/min)	f	\N	\N	\N
2373	250	\N	8	Bradypnea (RR <12/min)	f	\N	\N	\N
2374	250	\N	9	Abnormal breathing pattern	f	\N	\N	\N
2375	250	2374	1	Kussmaul breathing (metabolic acidosis)	f	\N	\N	\N
2376	250	2374	2	Cheyne-Stokes respirations (stroke, heart failure)	f	\N	\N	\N
2377	250	2374	3	Ataxic breathing (medullary lesion)	f	\N	\N	\N
2378	250	2374	4	Agonal respirations (impending respiratory arrest)	f	\N	\N	\N
2379	251	\N	1	Severe hypoglycemia (<40 mg/dL)	f	\N	\N	\N
2380	251	\N	2	Severe hyperglycemia (>600 mg/dL)	f	\N	\N	\N
2381	251	\N	3	Severe hyponatremia (<120 mEq/L)	f	\N	\N	\N
2382	251	\N	4	Severe hypernatremia (>160 mEq/L)	f	\N	\N	\N
2383	251	\N	5	Severe hypercalcemia (>14 mg/dL)	f	\N	\N	\N
2384	251	\N	6	Severe acid-base disturbance (pH <7.2 or >7.6)	f	\N	\N	\N
2385	251	\N	7	Severe anion gap metabolic acidosis (AG >20)	f	\N	\N	\N
2386	252	\N	1	Suspected opioid overdose (respiratory depression, miosis)	f	\N	\N	\N
2387	252	\N	2	Anticholinergic toxidrome (dry, flushed skin, mydriasis, delirium)	f	\N	\N	\N
2388	252	\N	3	Cholinergic crisis (salivation, lacrimation, urination, defecation, GI distress, emesis)	f	\N	\N	\N
2389	252	\N	4	Sympathomimetic toxicity (hypertension, tachycardia, hyperthermia, mydriasis)	f	\N	\N	\N
2390	252	\N	5	Serotonin syndrome (hyperreflexia, clonus, hyperthermia, agitation)	f	\N	\N	\N
2391	252	\N	6	Neuroleptic malignant syndrome (rigidity, hyperthermia, autonomic instability)	f	\N	\N	\N
2392	252	\N	7	Carbon monoxide poisoning (headache, dizziness, confusion)	f	\N	\N	\N
2393	252	\N	8	Cyanide toxicity (sudden collapse, seizures, lactic acidosis)	f	\N	\N	\N
2394	252	\N	9	Methemoglobinemia (cyanosis unresponsive to oxygen)	f	\N	\N	\N
2395	253	\N	1	Return of spontaneous circulation after cardiac arrest	f	\N	\N	\N
2396	253	\N	2	Comatose state post-resuscitation	f	\N	\N	\N
2397	253	\N	3	Post-anoxic status epilepticus (clinical or non-convulsive)	f	\N	\N	\N
2398	254	\N	1	Petechiae or purpura (meningococcemia, TTP, DIC)	f	\N	\N	\N
2399	254	\N	2	Jaundice (hepatic encephalopathy)	f	\N	\N	\N
2400	254	\N	3	Severe anemia (Hgb <7 g/dL)	f	\N	\N	\N
2401	254	\N	4	Status epilepticus or suspected non-convulsive status	f	\N	\N	\N
2402	255	\N	1	Diagnosis	t	Diagnosis	Enter diagnosis	\N
2403	255	\N	2	ICD-10 Code	t	ICD-10 Code	Enter icd-10 code	\N
2404	255	\N	3	Supporting evidence:	f	\N	\N	\N
2405	255	2404	1	History	f	\N	\N	\N
2406	255	2404	2	Physical examination	f	\N	\N	\N
2407	255	2404	3	Laboratory findings	f	\N	\N	\N
2408	255	2404	4	Imaging findings	f	\N	\N	\N
2409	255	2404	5	Special tests	f	\N	\N	\N
2410	255	2404	6	Other	t	Other	Enter other	\N
2411	256	\N	1	Differential diagnosis #1	t	Differential diagnosis #1	Enter differential diagnosis #1	\N
2412	256	2411	1	Supporting evidence	t	Supporting evidence	Enter supporting evidence	\N
2413	256	2411	2	Evidence against	t	Evidence against	Enter evidence against	\N
2414	256	\N	2	Differential diagnosis #2	t	Differential diagnosis #2	Enter differential diagnosis #2	\N
2415	256	2414	1	Supporting evidence	t	Supporting evidence	Enter supporting evidence	\N
2416	256	2414	2	Evidence against	t	Evidence against	Enter evidence against	\N
2417	256	\N	3	Differential diagnosis #3	t	Differential diagnosis #3	Enter differential diagnosis #3	\N
2418	256	2417	1	Supporting evidence	t	Supporting evidence	Enter supporting evidence	\N
2419	256	2417	2	Evidence against	t	Evidence against	Enter evidence against	\N
2420	257	\N	1	Vascular	f	\N	\N	\N
2421	257	2420	1	Ischemic	f	\N	\N	\N
2422	257	2420	2	Hemorrhagic	f	\N	\N	\N
2423	257	2420	3	Hypoperfusion	f	\N	\N	\N
2424	257	\N	2	Infectious	f	\N	\N	\N
2425	257	2424	1	Bacterial	f	\N	\N	\N
2426	257	2424	2	Viral	f	\N	\N	\N
2427	257	2424	3	Fungal	f	\N	\N	\N
2428	257	2424	4	Parasitic	f	\N	\N	\N
2429	257	\N	3	Metabolic	f	\N	\N	\N
2430	257	2429	1	Glucose related	f	\N	\N	\N
2431	257	2429	2	Electrolyte disturbance	f	\N	\N	\N
2432	257	2429	3	Acid-base disturbance	f	\N	\N	\N
2433	257	2429	4	Hepatic	f	\N	\N	\N
2434	257	2429	5	Renal	f	\N	\N	\N
2435	257	2429	6	Endocrine	f	\N	\N	\N
2436	257	\N	4	Toxic	f	\N	\N	\N
2437	257	2436	1	Medication related	f	\N	\N	\N
2438	257	2436	2	Substance use related	f	\N	\N	\N
2439	257	2436	3	Environmental exposure	f	\N	\N	\N
2440	257	\N	5	Traumatic	f	\N	\N	\N
2441	257	2440	1	Direct injury	f	\N	\N	\N
2442	257	2440	2	Secondary injury	f	\N	\N	\N
2443	257	\N	6	Neoplastic	f	\N	\N	\N
2444	257	2443	1	Primary	f	\N	\N	\N
2445	257	2443	2	Metastatic	f	\N	\N	\N
2446	257	2443	3	Paraneoplastic	f	\N	\N	\N
2447	257	\N	7	Autoimmune/inflammatory	f	\N	\N	\N
2448	257	\N	8	Structural	f	\N	\N	\N
2449	257	\N	9	Degenerative	f	\N	\N	\N
2450	257	\N	10	Iatrogenic	f	\N	\N	\N
2451	257	\N	11	Idiopathic	f	\N	\N	\N
2452	257	\N	12	Multifactorial	f	\N	\N	\N
2453	258	\N	1	Mild	f	\N	\N	\N
2454	258	\N	2	Moderate	f	\N	\N	\N
2455	258	\N	3	Severe	f	\N	\N	\N
2456	258	\N	4	Life-threatening	f	\N	\N	\N
2457	258	\N	5	Clinical scales used:	f	\N	\N	\N
2458	258	2457	1	Glasgow Coma Scale	t	Glasgow Coma Scale	Enter glasgow coma scale	\N
2459	258	2457	2	FOUR Score	t	FOUR Score	Enter four score	\N
2460	258	2457	3	NIH Stroke Scale	t	NIH Stroke Scale	Enter nih stroke scale	\N
2461	258	2457	4	Modified Rankin Scale	t	Modified Rankin Scale	Enter modified rankin scale	\N
2462	258	2457	5	Other scale	t	Other scale	Enter other scale	\N
2463	259	\N	1	Positive prognostic factors:	f	\N	\N	\N
2464	259	2463	1	Young age	f	\N	\N	\N
2465	259	2463	2	No pre-existing comorbidities	f	\N	\N	\N
2466	259	2463	3	Early treatment	f	\N	\N	\N
2467	259	2463	4	Good response to initial treatment	f	\N	\N	\N
2468	259	2463	5	Preserved brainstem reflexes	f	\N	\N	\N
2469	259	2463	6	Lack of severe complications	f	\N	\N	\N
2470	259	2463	7	Other	t	Other	Enter other	\N
2471	259	\N	2	Negative prognostic factors:	f	\N	\N	\N
2472	259	2471	1	Advanced age	f	\N	\N	\N
2473	259	2471	2	Significant comorbidities	f	\N	\N	\N
2474	259	2471	3	Delayed presentation	f	\N	\N	\N
2475	259	2471	4	Poor response to initial treatment	f	\N	\N	\N
2476	259	2471	5	Loss of brainstem reflexes	f	\N	\N	\N
2477	259	2471	6	Development of complications	f	\N	\N	\N
2478	259	2471	7	Other	t	Other	Enter other	\N
2479	260	\N	1	Current complications:	f	\N	\N	\N
2480	260	2479	1	Respiratory	f	\N	\N	\N
2481	260	2480	1	Aspiration	f	\N	\N	\N
2482	260	2480	2	Respiratory failure	f	\N	\N	\N
2483	260	2480	3	Pneumonia	f	\N	\N	\N
2484	260	2479	2	Cardiovascular	f	\N	\N	\N
2485	260	2484	1	Hypertension	f	\N	\N	\N
2486	260	2484	2	Hypotension	f	\N	\N	\N
2487	260	2484	3	Arrhythmia	f	\N	\N	\N
2488	260	2479	3	Neurological	f	\N	\N	\N
2489	260	2488	1	Increased intracranial pressure	f	\N	\N	\N
2490	260	2488	2	Herniation	f	\N	\N	\N
2491	260	2488	3	Seizures	f	\N	\N	\N
2492	260	2488	4	Hydrocephalus	f	\N	\N	\N
2493	260	2479	4	Other organ system	t	Other organ system	Enter other organ system	\N
2494	260	\N	2	Potential complications:	f	\N	\N	\N
2495	260	2494	1	Respiratory	f	\N	\N	\N
2496	260	2494	2	Cardiovascular	f	\N	\N	\N
2497	260	2494	3	Neurological	f	\N	\N	\N
2498	260	2494	4	Infectious	f	\N	\N	\N
2499	260	2494	5	Metabolic	f	\N	\N	\N
2500	260	2494	6	Other	t	Other	Enter other	\N
2501	261	\N	1	Premorbid functional status:	f	\N	\N	\N
2502	261	2501	1	Independent	f	\N	\N	\N
2503	261	2501	2	Partially dependent	f	\N	\N	\N
2504	261	2501	3	Dependent	f	\N	\N	\N
2505	261	\N	2	Current functional limitations:	f	\N	\N	\N
2506	261	2505	1	Cognitive	f	\N	\N	\N
2507	261	2505	2	Motor	f	\N	\N	\N
2508	261	2505	3	Sensory	f	\N	\N	\N
2509	261	2505	4	Speech/language	f	\N	\N	\N
2510	261	2505	5	Other	t	Other	Enter other	\N
2511	261	\N	3	Anticipated recovery:	f	\N	\N	\N
2512	261	2511	1	Complete	f	\N	\N	\N
2513	261	2511	2	Partial	f	\N	\N	\N
2514	261	2511	3	Minimal	f	\N	\N	\N
2515	261	2511	4	Unknown	f	\N	\N	\N
2516	262	\N	1	Improving	f	\N	\N	\N
2517	262	\N	2	Stable	f	\N	\N	\N
2518	262	\N	3	Worsening	f	\N	\N	\N
2519	262	\N	4	Fluctuating	f	\N	\N	\N
2520	262	\N	5	Undetermined	f	\N	\N	\N
2521	263	\N	1	Family member	f	\N	\N	\N
2522	263	2521	1	Relationship	t	Relationship	Enter relationship	\N
2523	263	2521	2	Contact information	t	Contact information	Enter contact information	\N
2524	263	\N	2	Friend	f	\N	\N	\N
2525	263	2524	1	Relationship	t	Relationship	Enter relationship	\N
2526	263	2524	2	Contact information	t	Contact information	Enter contact information	\N
2527	263	\N	3	Caregiver	f	\N	\N	\N
2528	263	2527	1	Professional	f	\N	\N	\N
2529	263	2527	2	Non-professional	f	\N	\N	\N
2530	263	2527	3	Contact information	t	Contact information	Enter contact information	\N
2531	263	\N	4	EMS personnel	f	\N	\N	\N
2532	263	\N	5	Police/Law enforcement	f	\N	\N	\N
2533	263	\N	6	Witnesses at scene	f	\N	\N	\N
2534	263	\N	7	Medical records	f	\N	\N	\N
2535	263	\N	8	Pharmacy records	f	\N	\N	\N
2536	263	\N	9	Other	t	Other	Enter other	\N
2537	264	\N	1	Baseline mental status	f	\N	\N	\N
2538	264	2537	1	Alert and oriented	f	\N	\N	\N
2539	264	2537	2	Baseline cognitive impairment	f	\N	\N	\N
2540	264	2537	3	Baseline confusion	f	\N	\N	\N
2541	264	2537	4	Dementia (established diagnosis)	f	\N	\N	\N
2542	264	\N	2	Recent behavioral changes	f	\N	\N	\N
2543	264	2542	1	Agitation	f	\N	\N	\N
2544	264	2542	2	Withdrawal	f	\N	\N	\N
2545	264	2542	3	Personality changes	f	\N	\N	\N
2546	264	2542	4	Paranoia	f	\N	\N	\N
2547	264	2542	5	Other	t	Other	Enter other	\N
2548	264	\N	3	Functional status	f	\N	\N	\N
2549	264	2548	1	Independent	f	\N	\N	\N
2550	264	2548	2	Needs assistance with ADLs	f	\N	\N	\N
2551	264	2548	3	Bed-bound	f	\N	\N	\N
2552	264	2548	4	Uses assistive devices	t	Uses assistive devices	Enter uses assistive devices	\N
2553	265	\N	1	Witnessed event	f	\N	\N	\N
2554	265	2553	1	Time of onset	t	Time of onset	Enter time of onset	\N
2555	265	2553	2	Duration	t	Duration	Enter duration	\N
2556	265	\N	2	Unwitnessed event	f	\N	\N	\N
2557	265	2556	1	Last seen normal	t	Last seen normal	Enter last seen normal	\N
2558	265	2556	2	Found abnormal	t	Found abnormal	Enter found abnormal	\N
2559	265	\N	3	Reported seizure activity	f	\N	\N	\N
2560	265	2559	1	Duration	t	Duration	Enter duration	\N
2561	265	2559	2	Description	t	Description	Enter description	\N
2562	265	\N	4	Loss of consciousness	f	\N	\N	\N
2563	265	2562	1	Duration	t	Duration	Enter duration	\N
2564	265	\N	5	Fall or trauma associated with event	f	\N	\N	\N
2565	265	2564	1	Description	t	Description	Enter description	\N
2566	265	\N	6	Environmental context of event	f	\N	\N	\N
2567	265	2566	1	Location	t	Location	Enter location	\N
2568	265	2566	2	Activity at time of event	t	Activity at time of event	Enter activity at time of event	\N
2569	265	2566	3	Environmental hazards	t	Environmental hazards	Enter environmental hazards	\N
2570	266	\N	1	Known medical conditions not in medical record	f	\N	\N	\N
2571	266	\N	2	Previous similar episodes	f	\N	\N	\N
2572	266	2571	1	Frequency	t	Frequency	Enter frequency	\N
2573	266	2571	2	Most recent	t	Most recent	Enter most recent	\N
2574	266	2571	3	Diagnosed cause	t	Diagnosed cause	Enter diagnosed cause	\N
2575	266	\N	3	Previous hospitalizations	f	\N	\N	\N
2576	266	2575	1	Reason	t	Reason	Enter reason	\N
2577	266	2575	2	Location	t	Location	Enter location	\N
2578	266	2575	3	Date	t	Date	Enter date	\N
2579	266	\N	4	Previous diagnostic workup	f	\N	\N	\N
2580	266	2579	1	Type	t	Type	Enter type	\N
2581	266	2579	2	Results	t	Results	Enter results	\N
2582	266	2579	3	Location	t	Location	Enter location	\N
2583	267	\N	1	Current medications not in medical record	f	\N	\N	\N
2584	267	\N	2	Recent medication changes	f	\N	\N	\N
2585	267	\N	3	Medication adherence concerns	f	\N	\N	\N
2586	267	\N	4	Access to medications belonging to others	f	\N	\N	\N
2587	267	\N	5	Over-the-counter medication use	f	\N	\N	\N
2588	267	\N	6	Supplement/herbal remedy use	f	\N	\N	\N
2589	268	\N	1	Alcohol use	f	\N	\N	\N
2590	268	2589	1	Pattern	t	Pattern	Enter pattern	\N
2591	268	2589	2	Amount	t	Amount	Enter amount	\N
2592	268	2589	3	Last use	t	Last use	Enter last use	\N
2593	268	\N	2	Recreational drug use	f	\N	\N	\N
2594	268	2593	1	Substances	t	Substances	Enter substances	\N
2595	268	2593	2	Pattern	t	Pattern	Enter pattern	\N
2596	268	2593	3	Route	t	Route	Enter route	\N
2597	268	2593	4	Last use	t	Last use	Enter last use	\N
2598	268	\N	3	History of substance use disorder	f	\N	\N	\N
2599	268	\N	4	History of withdrawal symptoms	f	\N	\N	\N
2600	268	\N	5	Recent rehabilitation or detoxification	f	\N	\N	\N
2601	269	\N	1	Living situation	f	\N	\N	\N
2602	269	2601	1	Lives alone	f	\N	\N	\N
2603	269	2601	2	Lives with	t	Lives with	Enter lives with	\N
2604	269	2601	3	Homeless	f	\N	\N	\N
2605	269	2601	4	Facility resident	f	\N	\N	\N
2606	269	\N	2	Recent stressors	f	\N	\N	\N
2607	269	2606	1	Personal	f	\N	\N	\N
2608	269	2606	2	Financial	f	\N	\N	\N
2609	269	2606	3	Occupational	f	\N	\N	\N
2610	269	2606	4	Other	t	Other	Enter other	\N
2611	269	\N	3	Access to care	f	\N	\N	\N
2612	269	2611	1	Primary care provider	t	Primary care provider	Enter primary care provider	\N
2613	269	2611	2	Specialists	t	Specialists	Enter specialists	\N
2614	269	2611	3	Barriers to healthcare	t	Barriers to healthcare	Enter barriers to healthcare	\N
2615	270	\N	1	Advance directive exists	f	\N	\N	\N
2616	270	2615	1	Location	t	Location	Enter location	\N
2617	270	\N	2	Healthcare proxy identified	f	\N	\N	\N
2618	270	2617	1	Name	t	Name	Enter name	\N
2619	270	2617	2	Contact	t	Contact	Enter contact	\N
2620	270	\N	3	DNR/DNI status	f	\N	\N	\N
2621	270	\N	4	Other care preferences	t	Other care preferences	Enter other care preferences	\N
2622	271	\N	1	Normal dietary intake	f	\N	\N	\N
2623	271	\N	2	Reduced intake	f	\N	\N	\N
2624	271	2623	1	Duration	t	Duration	Enter duration	\N
2625	271	2623	2	Estimated percentage of normal intake	t	Estimated percentage of normal intake	Enter estimated percentage of normal intake	\N
2626	271	\N	3	NPO status	f	\N	\N	\N
2627	271	2626	1	Duration	t	Duration	Enter duration	\N
2628	271	\N	4	Enteral feeding	f	\N	\N	\N
2629	271	\N	5	Parenteral nutrition	f	\N	\N	\N
2630	271	\N	6	Recent changes in appetite	f	\N	\N	\N
2631	271	2630	1	Increased	f	\N	\N	\N
2632	271	2630	2	Decreased	f	\N	\N	\N
2633	271	2630	3	Duration	t	Duration	Enter duration	\N
2634	272	\N	1	Normal hydration	f	\N	\N	\N
2635	272	\N	2	Signs of dehydration	f	\N	\N	\N
2636	272	2635	1	Mild	f	\N	\N	\N
2637	272	2635	2	Moderate	f	\N	\N	\N
2638	272	2635	3	Severe	f	\N	\N	\N
2639	272	\N	3	Fluid restriction	f	\N	\N	\N
2640	272	\N	4	Increased fluid intake	f	\N	\N	\N
2641	272	\N	5	IV fluid administration	f	\N	\N	\N
2642	273	\N	1	No recent weight changes	f	\N	\N	\N
2643	273	\N	2	Recent weight loss	f	\N	\N	\N
2644	273	2643	1	_____ kg over _____ days/weeks/months	f	\N	\N	\N
2645	273	2643	2	Intentional	f	\N	\N	\N
2646	273	2643	3	Unintentional	f	\N	\N	\N
2647	273	\N	3	Recent weight gain	f	\N	\N	\N
2648	273	2647	1	_____ kg over _____ days/weeks/months	f	\N	\N	\N
2649	274	\N	1	No restrictions	f	\N	\N	\N
2650	274	\N	2	Diabetic diet	f	\N	\N	\N
2651	274	\N	3	Low sodium diet	f	\N	\N	\N
2652	274	\N	4	Renal diet	f	\N	\N	\N
2653	274	\N	5	Gluten-free	f	\N	\N	\N
2654	274	\N	6	Other	t	Other	Enter other	\N
2655	275	\N	1	No alcohol use	f	\N	\N	\N
2656	275	\N	2	Social alcohol use	f	\N	\N	\N
2657	275	\N	3	Regular alcohol use	f	\N	\N	\N
2658	275	2657	1	Frequency	t	Frequency	Enter frequency	\N
2659	275	2657	2	Amount	t	Amount	Enter amount	\N
2660	275	2657	3	Type	t	Type	Enter type	\N
2661	275	\N	4	Heavy alcohol use (>14 drinks/week for men, >7 drinks/week for women)	f	\N	\N	\N
2662	275	\N	5	Recent alcohol cessation	f	\N	\N	\N
2663	275	2662	1	Last drink	t	Last drink	Enter last drink	\N
2664	275	\N	6	History of alcohol withdrawal	f	\N	\N	\N
2665	275	\N	7	Unknown alcohol history	f	\N	\N	\N
2666	276	\N	1	Malnutrition	f	\N	\N	\N
2667	276	2666	1	Mild	f	\N	\N	\N
2668	276	2666	2	Moderate	f	\N	\N	\N
2669	276	2666	3	Severe	f	\N	\N	\N
2670	276	\N	2	Vitamin deficiencies	f	\N	\N	\N
2671	276	2670	1	Suspected thiamine deficiency (Wernicke's encephalopathy)	f	\N	\N	\N
2672	276	2670	2	Suspected B12 deficiency	f	\N	\N	\N
2673	276	2670	3	Other vitamin deficiencies	t	Other vitamin deficiencies	Enter other vitamin deficiencies	\N
2674	276	\N	3	History of bariatric surgery	f	\N	\N	\N
2675	276	\N	4	Eating disorder	f	\N	\N	\N
2676	276	\N	5	Malabsorption syndrome	f	\N	\N	\N
2677	276	\N	6	Food allergies/intolerances	t	Food allergies/intolerances	Enter food allergies/intolerances	\N
2678	277	\N	1	Recent food poisoning/illness	f	\N	\N	\N
2679	277	\N	2	Ingestion of unfamiliar foods	f	\N	\N	\N
2680	277	\N	3	Ingestion of potentially contaminated foods	f	\N	\N	\N
2681	277	\N	4	Ingestion of wild mushrooms/plants	f	\N	\N	\N
2682	277	\N	5	Fasting	f	\N	\N	\N
2683	277	2682	1	Religious	f	\N	\N	\N
2684	277	2682	2	For medical procedure	f	\N	\N	\N
2685	277	2682	3	Other	t	Other	Enter other	\N
2686	278	\N	1	Ischemic stroke (I63.9)	f	\N	\N	\N
2687	278	2686	1	Anterior circulation	f	\N	\N	\N
2688	278	2686	2	Posterior circulation	f	\N	\N	\N
2689	278	2686	3	Basilar artery occlusion (I65.1)	f	\N	\N	\N
2690	278	2686	4	Lacunar infarct (I63.9)	f	\N	\N	\N
2691	278	\N	2	Hemorrhagic stroke	f	\N	\N	\N
2692	278	2691	1	Intracerebral hemorrhage (I61.9)	f	\N	\N	\N
2693	278	2691	2	Subarachnoid hemorrhage (I60.9)	f	\N	\N	\N
2694	278	2691	3	Epidural hematoma (S06.4X0A)	f	\N	\N	\N
2695	278	2691	4	Subdural hematoma (S06.5X0A)	f	\N	\N	\N
2696	278	\N	3	Cerebral venous thrombosis (I67.6)	f	\N	\N	\N
2697	278	\N	4	Hypertensive encephalopathy (I67.4)	f	\N	\N	\N
2698	278	\N	5	Posterior reversible encephalopathy syndrome (PRES) (G93.6)	f	\N	\N	\N
2699	278	\N	6	Vascular dementia (F01.50)	f	\N	\N	\N
2700	278	\N	7	Vertebrobasilar insufficiency (G45.0)	f	\N	\N	\N
2701	278	\N	8	Hypoperfusion state (R57.9)	f	\N	\N	\N
2702	279	\N	1	Meningitis (G03.9)	f	\N	\N	\N
2703	279	2702	1	Bacterial (G00.9)	f	\N	\N	\N
2704	279	2702	2	Viral (A87.9)	f	\N	\N	\N
2705	279	2702	3	Fungal (B37.5)	f	\N	\N	\N
2706	279	\N	2	Encephalitis (G04.90)	f	\N	\N	\N
2707	279	2706	1	Viral (e.g., HSV) (B00.4)	f	\N	\N	\N
2708	279	2706	2	Autoimmune (G04.81)	f	\N	\N	\N
2709	279	\N	3	Brain abscess (G06.0)	f	\N	\N	\N
2710	279	\N	4	Progressive multifocal leukoencephalopathy (A81.2)	f	\N	\N	\N
2711	279	\N	5	HIV-associated neurocognitive disorder (B20)	f	\N	\N	\N
2712	279	\N	6	Central nervous system vasculitis (I67.7)	f	\N	\N	\N
2713	279	\N	7	Septic encephalopathy (G93.41)	f	\N	\N	\N
2714	279	\N	8	COVID-19 encephalopathy (U07.1)	f	\N	\N	\N
2715	280	\N	1	Concussion (S06.0X0A)	f	\N	\N	\N
2716	280	\N	2	Traumatic brain injury (S06.9XXA)	f	\N	\N	\N
2717	280	2716	1	Mild	f	\N	\N	\N
2718	280	2716	2	Moderate	f	\N	\N	\N
2719	280	2716	3	Severe	f	\N	\N	\N
2720	280	\N	3	Diffuse axonal injury (S06.2X0A)	f	\N	\N	\N
2721	280	\N	4	Cerebrospinal fluid leak (G96.0)	f	\N	\N	\N
2722	281	\N	1	Hypoglycemia (E16.2)	f	\N	\N	\N
2723	281	\N	2	Hyperglycemia (R73.9)	f	\N	\N	\N
2724	281	2723	1	Diabetic ketoacidosis (E11.10)	f	\N	\N	\N
2725	281	2723	2	Hyperosmolar hyperglycemic state (E11.00)	f	\N	\N	\N
2726	281	\N	3	Electrolyte abnormalities	f	\N	\N	\N
2727	281	2726	1	Hyponatremia (E87.1)	f	\N	\N	\N
2728	281	2726	2	Hypernatremia (E87.0)	f	\N	\N	\N
2729	281	2726	3	Hypocalcemia (E83.51)	f	\N	\N	\N
2730	281	2726	4	Hypercalcemia (E83.52)	f	\N	\N	\N
2731	281	\N	4	Hepatic encephalopathy (K72.90)	f	\N	\N	\N
2732	281	\N	5	Uremic encephalopathy (N18.9)	f	\N	\N	\N
2733	281	\N	6	Hypoxic-ischemic encephalopathy (G93.1)	f	\N	\N	\N
2734	281	\N	7	Wernicke encephalopathy (E51.2)	f	\N	\N	\N
2735	281	\N	8	Vitamin B12 deficiency (E53.8)	f	\N	\N	\N
2736	281	\N	9	Thyroid dysfunction	f	\N	\N	\N
2737	281	2736	1	Myxedema coma (E03.5)	f	\N	\N	\N
2738	281	2736	2	Thyroid storm (E05.91)	f	\N	\N	\N
2739	281	\N	10	Adrenal crisis (E27.2)	f	\N	\N	\N
2740	281	\N	11	Porphyria (E80.20)	f	\N	\N	\N
2741	281	\N	12	Substance intoxication (F19.929)	f	\N	\N	\N
2742	281	2741	1	Alcohol (F10.929)	f	\N	\N	\N
2743	281	2741	2	Opioids (F11.929)	f	\N	\N	\N
2744	281	2741	3	Sedatives/hypnotics (F13.929)	f	\N	\N	\N
2745	281	2741	4	Stimulants (F15.929)	f	\N	\N	\N
2746	281	2741	5	Other	t	Other	Enter other	\N
2747	281	\N	13	Substance withdrawal (F19.239)	f	\N	\N	\N
2748	281	2747	1	Alcohol (F10.239)	f	\N	\N	\N
2749	281	2747	2	Benzodiazepines (F13.239)	f	\N	\N	\N
2750	281	2747	3	Opioids (F11.23)	f	\N	\N	\N
2751	281	2747	4	Other	t	Other	Enter other	\N
2752	281	\N	14	Medication adverse effect (T88.7XXA)	f	\N	\N	\N
2753	281	\N	15	Carbon monoxide poisoning (T58.94XA)	f	\N	\N	\N
2754	281	\N	16	Heavy metal poisoning (T56.9X1A)	f	\N	\N	\N
2755	282	\N	1	Postictal state (G40.909)	f	\N	\N	\N
2756	282	\N	2	Status epilepticus (G40.901)	f	\N	\N	\N
2757	282	\N	3	Non-convulsive status epilepticus (G40.909)	f	\N	\N	\N
2758	282	\N	4	New-onset seizure (G40.909)	f	\N	\N	\N
2759	283	\N	1	Primary brain tumor (C71.9)	f	\N	\N	\N
2760	283	\N	2	Metastatic brain tumor (C79.31)	f	\N	\N	\N
2761	283	\N	3	Paraneoplastic syndrome (G13.1)	f	\N	\N	\N
2762	283	\N	4	Carcinomatous meningitis (C79.32)	f	\N	\N	\N
2763	284	\N	1	Multiple sclerosis (G35)	f	\N	\N	\N
2764	284	\N	2	Acute disseminated encephalomyelitis (G04.01)	f	\N	\N	\N
2765	284	\N	3	Autoimmune encephalitis (G04.81)	f	\N	\N	\N
2766	284	2765	1	Anti-NMDA receptor encephalitis	f	\N	\N	\N
2767	284	2765	2	Limbic encephalitis	f	\N	\N	\N
2768	284	\N	4	Systemic lupus erythematosus (M32.9)	f	\N	\N	\N
2769	284	\N	5	Hashimoto encephalopathy (G13.8)	f	\N	\N	\N
2770	285	\N	1	Increased intracranial pressure (G93.2)	f	\N	\N	\N
2771	285	\N	2	Normal pressure hydrocephalus (G91.2)	f	\N	\N	\N
2772	285	\N	3	Dementia (F03)	f	\N	\N	\N
2773	285	2772	1	Alzheimer's disease (G30.9)	f	\N	\N	\N
2774	285	2772	2	Lewy body dementia (G31.83)	f	\N	\N	\N
2775	285	2772	3	Frontotemporal dementia (G31.09)	f	\N	\N	\N
2776	285	\N	4	Migraine with aura (G43.109)	f	\N	\N	\N
2777	285	\N	5	Transient global amnesia (G45.4)	f	\N	\N	\N
2778	286	\N	1	Psychogenic non-epileptic seizures (F44.5)	f	\N	\N	\N
2779	286	\N	2	Acute psychosis (F29)	f	\N	\N	\N
2780	286	\N	3	Catatonia (F20.2)	f	\N	\N	\N
2781	286	\N	4	Severe depression (F32.9)	f	\N	\N	\N
2782	286	\N	5	Dissociative disorder (F44.9)	f	\N	\N	\N
2783	286	\N	6	Conversion disorder (F44.9)	f	\N	\N	\N
2784	287	\N	1	Post-cardiac arrest syndrome (I46.9)	f	\N	\N	\N
2785	287	\N	2	Hypoxic-ischemic brain injury (G93.1)	f	\N	\N	\N
2786	288	\N	1	Intensive Care Unit	f	\N	\N	\N
2787	288	2786	1	Neurocritical Care Unit	f	\N	\N	\N
2788	288	2786	2	Medical ICU	f	\N	\N	\N
2789	288	2786	3	Surgical ICU	f	\N	\N	\N
2790	288	2786	4	Cardiac ICU	f	\N	\N	\N
2791	288	\N	2	Step-down Unit	f	\N	\N	\N
2792	288	2791	1	Neurological	f	\N	\N	\N
2793	288	2791	2	Medical	f	\N	\N	\N
2794	288	2791	3	Surgical	f	\N	\N	\N
2795	288	\N	3	General Floor	f	\N	\N	\N
2796	288	2795	1	Neurological	f	\N	\N	\N
2797	288	2795	2	Medical	f	\N	\N	\N
2798	288	2795	3	Surgical	f	\N	\N	\N
2799	288	\N	4	Observation Unit	f	\N	\N	\N
2800	288	\N	5	Emergency Department	f	\N	\N	\N
2801	288	2800	1	Continued monitoring	f	\N	\N	\N
2802	288	2800	2	Awaiting results	f	\N	\N	\N
2803	288	2800	3	Awaiting bed	f	\N	\N	\N
2804	288	\N	6	Operating Room	f	\N	\N	\N
2805	288	\N	7	Transfer to another facility	f	\N	\N	\N
2806	288	\N	8	Discharge	f	\N	\N	\N
2807	289	\N	1	Higher level of care needed	f	\N	\N	\N
2808	289	2807	1	Neurocritical care	f	\N	\N	\N
2809	289	2807	2	Neurosurgical capability	f	\N	\N	\N
2810	289	2807	3	Specialized neurological services	f	\N	\N	\N
2811	289	2807	4	Advanced imaging	f	\N	\N	\N
2812	289	2807	5	Other	t	Other	Enter other	\N
2813	289	\N	2	Transfer to another service	f	\N	\N	\N
2814	289	2813	1	From	t	From	Enter from	\N
2815	289	2813	2	To	t	To	Enter to	\N
2816	289	2813	3	Reason	t	Reason	Enter reason	\N
2817	289	\N	3	Transfer documentation	f	\N	\N	\N
2818	289	2817	1	Completed	f	\N	\N	\N
2819	289	2817	2	Pending	f	\N	\N	\N
2820	289	\N	4	Transport considerations	f	\N	\N	\N
2821	289	2820	1	Standard	f	\N	\N	\N
2822	289	2820	2	Critical care transport	f	\N	\N	\N
2823	289	2820	3	Air medical transport	f	\N	\N	\N
2824	289	2820	4	Equipment needs	t	Equipment needs	Enter equipment needs	\N
2825	289	2820	5	Personnel needs	t	Personnel needs	Enter personnel needs	\N
2826	290	\N	1	Discharge disposition	f	\N	\N	\N
2827	290	2826	1	Home	f	\N	\N	\N
2828	290	2827	1	With home health services	f	\N	\N	\N
2829	290	2827	2	Without services	f	\N	\N	\N
2830	290	2826	2	Acute inpatient rehabilitation	f	\N	\N	\N
2831	290	2826	3	Subacute rehabilitation	f	\N	\N	\N
2832	290	2826	4	Skilled nursing facility	f	\N	\N	\N
2833	290	2826	5	Long-term acute care	f	\N	\N	\N
2834	290	2826	6	Chronic care facility	f	\N	\N	\N
2835	290	2826	7	Hospice	f	\N	\N	\N
2836	290	2835	1	Inpatient	f	\N	\N	\N
2837	290	2835	2	Home hospice	f	\N	\N	\N
2838	290	\N	2	Discharge readiness assessment	f	\N	\N	\N
2839	290	2838	1	Medically stable	f	\N	\N	\N
2840	290	2838	2	Functional status appropriate for disposition	f	\N	\N	\N
2841	290	2838	3	Support systems in place	f	\N	\N	\N
2842	290	2838	4	Equipment needs addressed	f	\N	\N	\N
2843	290	2838	5	Medications reconciled	f	\N	\N	\N
2844	290	2838	6	Patient/family education completed	f	\N	\N	\N
2845	290	\N	3	Estimated date of discharge	t	Estimated date of discharge	Enter estimated date of discharge	\N
2846	291	\N	1	Neurology follow-up	f	\N	\N	\N
2847	291	2846	1	Timeframe	t	Timeframe	Enter timeframe	\N
2848	291	2846	2	Provider	t	Provider	Enter provider	\N
2849	291	2846	3	Contact information	t	Contact information	Enter contact information	\N
2850	291	\N	2	Primary care follow-up	f	\N	\N	\N
2851	291	2850	1	Timeframe	t	Timeframe	Enter timeframe	\N
2852	291	2850	2	Provider	t	Provider	Enter provider	\N
2853	291	2850	3	Contact information	t	Contact information	Enter contact information	\N
2854	291	\N	3	Specialist follow-up	f	\N	\N	\N
2855	291	2854	1	Specialty	t	Specialty	Enter specialty	\N
2856	291	2854	2	Timeframe	t	Timeframe	Enter timeframe	\N
2857	291	2854	3	Provider	t	Provider	Enter provider	\N
2858	291	2854	4	Contact information	t	Contact information	Enter contact information	\N
2859	291	\N	4	Post-discharge testing	f	\N	\N	\N
2860	291	2859	1	Test	t	Test	Enter test	\N
2861	291	2859	2	Timeframe	t	Timeframe	Enter timeframe	\N
2862	291	2859	3	Location	t	Location	Enter location	\N
2863	292	\N	1	Patient able to use personal transportation	f	\N	\N	\N
2864	292	\N	2	Family/friend will transport	f	\N	\N	\N
2865	292	\N	3	Medical transport required	f	\N	\N	\N
2866	292	2865	1	Ambulance	f	\N	\N	\N
2867	292	2865	2	Wheelchair van	f	\N	\N	\N
2868	292	2865	3	Other	t	Other	Enter other	\N
2869	292	\N	4	Transportation assistance needed	f	\N	\N	\N
2870	292	2869	1	Type	t	Type	Enter type	\N
2871	292	2869	2	Arranged: Yes/No	f	\N	\N	\N
2872	293	\N	1	Medical barriers	f	\N	\N	\N
2873	293	2872	1	Ongoing diagnostic workup	f	\N	\N	\N
2874	293	2872	2	Clinical instability	f	\N	\N	\N
2875	293	2872	3	Requiring treatment only available in current setting	f	\N	\N	\N
2876	293	2872	4	Other	t	Other	Enter other	\N
2877	293	\N	2	System barriers	f	\N	\N	\N
2878	293	2877	1	Bed availability	f	\N	\N	\N
2879	293	2877	2	Insurance authorization	f	\N	\N	\N
2880	293	2877	3	Accepting facility issues	f	\N	\N	\N
2881	293	2877	4	Other	t	Other	Enter other	\N
2882	293	\N	3	Social barriers	f	\N	\N	\N
2883	293	2882	1	Lack of caregiver	f	\N	\N	\N
2884	293	2882	2	Unsafe discharge environment	f	\N	\N	\N
2885	293	2882	3	Financial constraints	f	\N	\N	\N
2886	293	2882	4	Other	t	Other	Enter other	\N
2887	294	\N	1	Handoff completed	f	\N	\N	\N
2888	294	2887	1	Verbal	f	\N	\N	\N
2889	294	2887	2	Written	f	\N	\N	\N
2890	294	2887	3	Electronic	f	\N	\N	\N
2891	294	\N	2	Receiving provider	t	Receiving provider	Enter receiving provider	\N
2892	294	\N	3	Family notified of disposition plan	f	\N	\N	\N
2893	294	2892	1	Contact	t	Contact	Enter contact	\N
2894	294	2892	2	Date/time	t	Date/time	Enter date/time	\N
2895	294	\N	4	Primary care provider notified	f	\N	\N	\N
2896	295	\N	1	Performed	f	\N	\N	\N
2897	295	2896	1	Date/time	t	Date/time	Enter date/time	\N
2898	295	\N	2	Rate	t	Rate	Enter rate	\N
2899	295	2898	1	Bradycardia (<60 bpm)	f	\N	\N	\N
2900	295	2898	2	Normal (60-100 bpm)	f	\N	\N	\N
2901	295	2898	3	Tachycardia (>100 bpm)	f	\N	\N	\N
2902	295	\N	3	Rhythm	f	\N	\N	\N
2903	295	2902	1	Normal sinus rhythm	f	\N	\N	\N
2904	295	2902	2	Sinus bradycardia	f	\N	\N	\N
2905	295	2902	3	Sinus tachycardia	f	\N	\N	\N
2906	295	2902	4	Other	t	Other	Enter other	\N
2907	295	\N	4	PR interval	t	PR interval	Enter pr interval	\N
2908	295	2907	1	Short (<120 ms)	f	\N	\N	\N
2909	295	2907	2	Normal (120-200 ms)	f	\N	\N	\N
2910	295	2907	3	Prolonged (>200 ms)	f	\N	\N	\N
2911	295	\N	5	QRS duration	t	QRS duration	Enter qrs duration	\N
2912	295	2911	1	Normal (<120 ms)	f	\N	\N	\N
2913	295	2911	2	Prolonged (≥120 ms)	f	\N	\N	\N
2914	295	\N	6	QT/QTc interval	t	QT/QTc interval	Enter qt/qtc interval	\N
2915	295	2914	1	Normal (QTc ≤440 ms in men, ≤460 ms in women)	f	\N	\N	\N
2916	295	2914	2	Prolonged	f	\N	\N	\N
2917	295	\N	7	Axis	f	\N	\N	\N
2918	295	2917	1	Normal (0° to +90°)	f	\N	\N	\N
2919	295	2917	2	Left axis deviation (-30° to -90°)	f	\N	\N	\N
2920	295	2917	3	Right axis deviation (+90° to +180°)	f	\N	\N	\N
2921	295	2917	4	Extreme axis deviation (-90° to -180°)	f	\N	\N	\N
2922	296	\N	1	Atrial arrhythmias	f	\N	\N	\N
2923	296	2922	1	Atrial fibrillation	f	\N	\N	\N
2924	296	2922	2	Atrial flutter	f	\N	\N	\N
2925	296	2922	3	Atrial tachycardia	f	\N	\N	\N
2926	296	2922	4	Multifocal atrial tachycardia	f	\N	\N	\N
2927	296	2922	5	Premature atrial contractions	f	\N	\N	\N
2928	296	\N	2	Junctional arrhythmias	f	\N	\N	\N
2929	296	2928	1	Junctional rhythm	f	\N	\N	\N
2930	296	2928	2	Junctional tachycardia	f	\N	\N	\N
2931	296	2928	3	AV nodal reentrant tachycardia (AVNRT)	f	\N	\N	\N
2932	296	\N	3	Ventricular arrhythmias	f	\N	\N	\N
2933	296	2932	1	Premature ventricular contractions	f	\N	\N	\N
2934	296	2932	2	Ventricular tachycardia	f	\N	\N	\N
2935	296	2932	3	Ventricular fibrillation	f	\N	\N	\N
2936	296	2932	4	Torsades de pointes	f	\N	\N	\N
2937	296	\N	4	Heart blocks	f	\N	\N	\N
2938	296	2937	1	First-degree AV block	f	\N	\N	\N
2939	296	2937	2	Second-degree AV block, Mobitz I (Wenckebach)	f	\N	\N	\N
2940	296	2937	3	Second-degree AV block, Mobitz II	f	\N	\N	\N
2941	296	2937	4	Third-degree (complete) AV block	f	\N	\N	\N
2942	296	2937	5	Bundle branch block	f	\N	\N	\N
2943	296	2942	1	Right (RBBB)	f	\N	\N	\N
2944	296	2942	2	Left (LBBB)	f	\N	\N	\N
2945	296	2937	6	Bifascicular block	f	\N	\N	\N
2946	296	2937	7	Trifascicular block	f	\N	\N	\N
2947	297	\N	1	ST segment elevation	f	\N	\N	\N
2948	297	2947	1	Location	t	Location	Enter location	\N
2949	297	2947	2	Amplitude	t	Amplitude	Enter amplitude	\N
2950	297	\N	2	ST segment depression	f	\N	\N	\N
2951	297	2950	1	Location	t	Location	Enter location	\N
2952	297	2950	2	Amplitude	t	Amplitude	Enter amplitude	\N
2953	297	\N	3	T wave inversion	f	\N	\N	\N
2954	297	2953	1	Location	t	Location	Enter location	\N
2955	297	\N	4	Q waves	f	\N	\N	\N
2956	297	2955	1	Location	t	Location	Enter location	\N
2957	297	\N	5	Hyperacute T waves	f	\N	\N	\N
2958	297	\N	6	Non-specific ST-T changes	f	\N	\N	\N
2959	298	\N	1	Left ventricular hypertrophy	f	\N	\N	\N
2960	298	\N	2	Right ventricular hypertrophy	f	\N	\N	\N
2961	298	\N	3	Left atrial enlargement	f	\N	\N	\N
2962	298	\N	4	Right atrial enlargement	f	\N	\N	\N
2963	298	\N	5	Low voltage	f	\N	\N	\N
2964	298	\N	6	Brugada pattern	f	\N	\N	\N
2965	298	\N	7	Osborn waves (J waves)	f	\N	\N	\N
2966	298	\N	8	Early repolarization	f	\N	\N	\N
2967	298	\N	9	U waves	f	\N	\N	\N
2968	298	\N	10	Delta waves	f	\N	\N	\N
2969	298	\N	11	Fragmented QRS	f	\N	\N	\N
2970	299	\N	1	Digoxin effect	f	\N	\N	\N
2971	299	\N	2	Calcium channel blocker effect	f	\N	\N	\N
2972	299	\N	3	Beta-blocker effect	f	\N	\N	\N
2973	299	\N	4	Class IA antiarrhythmic effect	f	\N	\N	\N
2974	299	\N	5	Class IC antiarrhythmic effect	f	\N	\N	\N
2975	299	\N	6	Class III antiarrhythmic effect	f	\N	\N	\N
2976	299	\N	7	Tricyclic antidepressant effect	f	\N	\N	\N
2977	300	\N	1	Hyperkalemia	f	\N	\N	\N
2978	300	\N	2	Hypokalemia	f	\N	\N	\N
2979	300	\N	3	Hypercalcemia	f	\N	\N	\N
2980	300	\N	4	Hypocalcemia	f	\N	\N	\N
2981	300	\N	5	Hypermagnesemia	f	\N	\N	\N
2982	300	\N	6	Hypomagnesemia	f	\N	\N	\N
2983	301	\N	1	Previous ECG available for comparison	f	\N	\N	\N
2984	301	2983	1	Date of previous ECG	t	Date of previous ECG	Enter date of previous ecg	\N
2985	301	2983	2	Changes since previous:	f	\N	\N	\N
2986	301	2985	1	New arrhythmia	f	\N	\N	\N
2987	301	2985	2	New conduction delay	f	\N	\N	\N
2988	301	2985	3	New ischemic changes	f	\N	\N	\N
2989	301	2985	4	Resolution of previous findings	f	\N	\N	\N
2990	301	2985	5	Other changes	t	Other changes	Enter other changes	\N
2991	302	\N	1	ECG findings consistent with:	f	\N	\N	\N
2992	302	2991	1	Acute coronary syndrome	f	\N	\N	\N
2993	302	2991	2	Previous myocardial infarction	f	\N	\N	\N
2994	302	2991	3	Pulmonary embolism	f	\N	\N	\N
2995	302	2991	4	Pericarditis	f	\N	\N	\N
2996	302	2991	5	Hyperkalemia	f	\N	\N	\N
2997	302	2991	6	Hypokalemia	f	\N	\N	\N
2998	302	2991	7	Drug effect	t	Drug effect	Enter drug effect	\N
2999	302	2991	8	Other	t	Other	Enter other	\N
3000	302	\N	2	ECG findings contributing to neurological presentation:	f	\N	\N	\N
3001	302	3000	1	Cardiac arrhythmia causing syncope/presyncope	f	\N	\N	\N
3002	302	3000	2	Cardiac ischemia as source of emboli	f	\N	\N	\N
3003	302	3000	3	Other	t	Other	Enter other	\N
3004	303	\N	1	Altered mental status	f	\N	\N	\N
3005	303	\N	2	Loss of consciousness	f	\N	\N	\N
3006	303	\N	3	Seizure	f	\N	\N	\N
3007	303	\N	4	Headache	f	\N	\N	\N
3008	303	\N	5	Confusion	f	\N	\N	\N
3009	303	\N	6	Behavioral change	f	\N	\N	\N
3010	303	\N	7	Other	t	Other	Enter other	\N
3011	304	\N	1	Abrupt onset (seconds to minutes)	f	\N	\N	\N
3012	304	\N	2	Gradual onset (hours)	f	\N	\N	\N
3013	304	\N	3	Progressive worsening (days)	f	\N	\N	\N
3014	304	\N	4	Fluctuating	f	\N	\N	\N
3015	304	\N	5	Constant	f	\N	\N	\N
3016	304	\N	6	Episodic	f	\N	\N	\N
3017	304	\N	7	Duration	t	Duration	Enter duration	\N
3018	305	\N	1	Headache	f	\N	\N	\N
3019	305	3018	1	Sudden onset, severe ("worst headache of life")	f	\N	\N	\N
3020	305	3018	2	Gradual onset	f	\N	\N	\N
3021	305	3018	3	Location	t	Location	Enter location	\N
3022	305	\N	2	Fever	f	\N	\N	\N
3023	305	\N	3	Neck stiffness/pain	f	\N	\N	\N
3024	305	\N	4	Nausea/vomiting	f	\N	\N	\N
3025	305	\N	5	Photophobia	f	\N	\N	\N
3026	305	\N	6	Visual changes	f	\N	\N	\N
3027	305	3026	1	Blurred vision	f	\N	\N	\N
3028	305	3026	2	Double vision	f	\N	\N	\N
3029	305	3026	3	Visual field defect	f	\N	\N	\N
3030	305	\N	7	Dizziness/vertigo	f	\N	\N	\N
3031	305	\N	8	Weakness	f	\N	\N	\N
3032	305	3031	1	Generalized	f	\N	\N	\N
3033	305	3031	2	Focal	t	Focal	Enter focal	\N
3034	305	\N	9	Sensory changes	f	\N	\N	\N
3035	305	\N	10	Speech difficulty	f	\N	\N	\N
3036	305	\N	11	Gait disturbance	f	\N	\N	\N
3037	305	\N	12	Tremor	f	\N	\N	\N
3038	305	\N	13	Incontinence (bowel/bladder)	f	\N	\N	\N
3039	306	\N	1	First episode	f	\N	\N	\N
3040	306	\N	2	Recurrent episodes	f	\N	\N	\N
3041	306	\N	3	Similar previous episodes	f	\N	\N	\N
3042	306	\N	4	Worsening compared to previous episodes	f	\N	\N	\N
3043	307	\N	1	Recent trauma/injury	f	\N	\N	\N
3044	307	\N	2	Recent illness/infection	f	\N	\N	\N
3045	307	\N	3	Medication change	f	\N	\N	\N
3046	307	\N	4	Alcohol use	f	\N	\N	\N
3047	307	\N	5	Recreational drug use	f	\N	\N	\N
3048	307	\N	6	Missing medication doses	f	\N	\N	\N
3049	307	\N	7	Sleep deprivation	f	\N	\N	\N
3050	307	\N	8	Emotional stress	f	\N	\N	\N
3051	307	\N	9	Physical exertion	f	\N	\N	\N
3052	307	\N	10	Heat exposure	f	\N	\N	\N
3053	307	\N	11	Fasting/missed meals	f	\N	\N	\N
3054	307	\N	12	Travel/altitude change	f	\N	\N	\N
3055	307	\N	13	Other	t	Other	Enter other	\N
3056	308	\N	1	Rest	f	\N	\N	\N
3057	308	\N	2	Medication (specify)	t	Medication (specify)	Enter medication (specify)	\N
3058	308	\N	3	Position change	f	\N	\N	\N
3059	308	\N	4	Other	t	Other	Enter other	\N
3060	309	\N	1	Witnessed by	t	Witnessed by	Enter witnessed by	\N
3061	309	\N	2	Duration of unconsciousness	t	Duration of unconsciousness	Enter duration of unconsciousness	\N
3062	309	\N	3	Seizure activity observed	f	\N	\N	\N
3063	309	3062	1	Generalized convulsions	f	\N	\N	\N
3064	309	3062	2	Focal movements	f	\N	\N	\N
3065	309	3062	3	Duration	t	Duration	Enter duration	\N
3066	309	\N	4	Post-event confusion	f	\N	\N	\N
3067	309	\N	5	Incontinence during event	f	\N	\N	\N
3068	309	\N	6	Injury during event	f	\N	\N	\N
3069	309	\N	7	Response to initial interventions	f	\N	\N	\N
3070	310	\N	1	Ordered	f	\N	\N	\N
3071	310	\N	2	Completed	f	\N	\N	\N
3072	310	\N	3	Findings:	f	\N	\N	\N
3073	310	3072	1	Normal	f	\N	\N	\N
3074	310	3072	2	Intracranial hemorrhage	f	\N	\N	\N
3075	310	3074	1	Intraparenchymal hemorrhage	f	\N	\N	\N
3076	310	3074	2	Subarachnoid hemorrhage	f	\N	\N	\N
3077	310	3074	3	Subdural hematoma	f	\N	\N	\N
3078	310	3074	4	Epidural hematoma	f	\N	\N	\N
3079	310	3074	5	Intraventricular hemorrhage	f	\N	\N	\N
3080	310	3072	3	Ischemic stroke	f	\N	\N	\N
3081	310	3080	1	Early signs	f	\N	\N	\N
3082	310	3080	2	Established infarct	f	\N	\N	\N
3083	310	3072	4	Mass lesion	f	\N	\N	\N
3084	310	3083	1	Location	t	Location	Enter location	\N
3085	310	3083	2	Size	t	Size	Enter size	\N
3086	310	3083	3	Edema	t	Edema	Enter edema	\N
3087	310	3083	4	Mass effect	t	Mass effect	Enter mass effect	\N
3088	310	3072	5	Hydrocephalus	f	\N	\N	\N
3089	310	3072	6	Cerebral edema	f	\N	\N	\N
3090	310	3072	7	Midline shift	f	\N	\N	\N
3091	310	3090	1	_____ mm	f	\N	\N	\N
3092	310	3072	8	Skull fracture	f	\N	\N	\N
3093	310	3072	9	Pneumocephalus	f	\N	\N	\N
3094	310	3072	10	Other	t	Other	Enter other	\N
3095	311	\N	1	Ordered	f	\N	\N	\N
3096	311	\N	2	Completed	f	\N	\N	\N
3097	311	\N	3	Findings:	f	\N	\N	\N
3098	311	3097	1	Normal	f	\N	\N	\N
3099	311	3097	2	Vascular occlusion	f	\N	\N	\N
3100	311	3099	1	Location	t	Location	Enter location	\N
3101	311	3097	3	Vascular stenosis	f	\N	\N	\N
3102	311	3101	1	Location	t	Location	Enter location	\N
3103	311	3101	2	Severity	t	Severity	Enter severity	\N
3104	311	3097	4	Aneurysm	f	\N	\N	\N
3105	311	3104	1	Location	t	Location	Enter location	\N
3106	311	3104	2	Size	t	Size	Enter size	\N
3107	311	3097	5	Arteriovenous malformation	f	\N	\N	\N
3108	311	3097	6	Carotid dissection	f	\N	\N	\N
3109	311	3097	7	Vertebral dissection	f	\N	\N	\N
3110	311	3097	8	Cerebral venous sinus thrombosis	f	\N	\N	\N
3111	311	3097	9	Other	t	Other	Enter other	\N
3112	312	\N	1	Ordered	f	\N	\N	\N
3113	312	\N	2	Completed	f	\N	\N	\N
3114	312	\N	3	Type:	f	\N	\N	\N
3115	312	3114	1	MRI brain without contrast	f	\N	\N	\N
3116	312	3114	2	MRI brain with contrast	f	\N	\N	\N
3117	312	3114	3	MRI brain with and without contrast	f	\N	\N	\N
3118	312	3114	4	MR angiography	f	\N	\N	\N
3119	312	3114	5	MR venography	f	\N	\N	\N
3120	312	3114	6	Diffusion-weighted imaging	f	\N	\N	\N
3121	312	3114	7	FLAIR	f	\N	\N	\N
3122	312	3114	8	Other sequences	t	Other sequences	Enter other sequences	\N
3123	312	\N	4	Findings:	f	\N	\N	\N
3124	312	3123	1	Normal	f	\N	\N	\N
3125	312	3123	2	Acute ischemic stroke	f	\N	\N	\N
3126	312	3125	1	Location	t	Location	Enter location	\N
3127	312	3125	2	Size	t	Size	Enter size	\N
3128	312	3123	3	Intracranial hemorrhage	f	\N	\N	\N
3129	312	3123	4	Mass lesion	f	\N	\N	\N
3130	312	3123	5	Encephalitis	f	\N	\N	\N
3131	312	3123	6	Demyelination	f	\N	\N	\N
3132	312	3123	7	Posterior reversible encephalopathy syndrome (PRES)	f	\N	\N	\N
3133	312	3123	8	Leukoencephalopathy	f	\N	\N	\N
3134	312	3123	9	Meningeal enhancement	f	\N	\N	\N
3135	312	3123	10	Other	t	Other	Enter other	\N
3136	313	\N	1	Ordered	f	\N	\N	\N
3137	313	\N	2	Completed	f	\N	\N	\N
3138	313	\N	3	Findings:	f	\N	\N	\N
3139	313	3138	1	Normal	f	\N	\N	\N
3140	313	3138	2	Pulmonary edema	f	\N	\N	\N
3141	313	3138	3	Pneumonia	f	\N	\N	\N
3142	313	3138	4	Pleural effusion	f	\N	\N	\N
3143	313	3138	5	Pneumothorax	f	\N	\N	\N
3144	313	3138	6	Cardiomegaly	f	\N	\N	\N
3145	313	3138	7	Pulmonary nodule/mass	f	\N	\N	\N
3146	313	3138	8	Other	t	Other	Enter other	\N
3147	314	\N	1	Ordered	f	\N	\N	\N
3148	314	\N	2	Completed	f	\N	\N	\N
3149	314	\N	3	Findings:	f	\N	\N	\N
3150	314	3149	1	Normal	f	\N	\N	\N
3151	314	3149	2	Pulmonary embolism	f	\N	\N	\N
3152	314	3149	3	Pneumonia	f	\N	\N	\N
3153	314	3149	4	Lung mass	f	\N	\N	\N
3154	314	3149	5	Other	t	Other	Enter other	\N
3155	315	\N	1	Ordered	f	\N	\N	\N
3156	315	\N	2	Completed	f	\N	\N	\N
3157	315	\N	3	Findings:	f	\N	\N	\N
3158	315	3157	1	Normal	f	\N	\N	\N
3159	315	3157	2	Hepatic abnormality	f	\N	\N	\N
3160	315	3157	3	Renal abnormality	f	\N	\N	\N
3161	315	3157	4	Bowel abnormality	f	\N	\N	\N
3162	315	3157	5	Free fluid	f	\N	\N	\N
3163	315	3157	6	Other	t	Other	Enter other	\N
3164	316	\N	1	Ordered	f	\N	\N	\N
3165	316	\N	2	Completed	f	\N	\N	\N
3166	316	\N	3	Type:	f	\N	\N	\N
3167	316	3166	1	Abdominal	f	\N	\N	\N
3168	316	3166	2	Renal	f	\N	\N	\N
3169	316	3166	3	Cardiac	f	\N	\N	\N
3170	316	3166	4	Vascular	f	\N	\N	\N
3171	316	3166	5	Other	t	Other	Enter other	\N
3172	316	\N	4	Findings	t	Findings	Enter findings	\N
3173	317	\N	1	Ordered	f	\N	\N	\N
3174	317	\N	2	Completed	f	\N	\N	\N
3175	317	\N	3	Findings:	f	\N	\N	\N
3176	317	3175	1	Normal	f	\N	\N	\N
3177	317	3175	2	Vasospasm	f	\N	\N	\N
3178	317	3175	3	Increased intracranial pressure	f	\N	\N	\N
3179	317	3175	4	Other	t	Other	Enter other	\N
3180	318	\N	1	Ordered	f	\N	\N	\N
3181	318	\N	2	Completed	f	\N	\N	\N
3182	318	\N	3	Findings:	f	\N	\N	\N
3183	318	3182	1	Normal	f	\N	\N	\N
3184	318	3182	2	Carotid stenosis	f	\N	\N	\N
3185	318	3184	1	Right	t	Right	Enter right	\N
3186	318	3184	2	Left	t	Left	Enter left	\N
3187	318	3182	3	Other	t	Other	Enter other	\N
3188	319	\N	1	Type	t	Type	Enter type	\N
3189	319	\N	2	Findings	t	Findings	Enter findings	\N
3190	320	\N	1	Glucose	f	\N	\N	\N
3191	320	3190	1	Value	t	Value	Enter value	\N
3192	320	3190	2	Hypoglycemia (<70 mg/dL)	f	\N	\N	\N
3193	320	3190	3	Severe hypoglycemia (<40 mg/dL)	f	\N	\N	\N
3194	320	3190	4	Hyperglycemia (>200 mg/dL)	f	\N	\N	\N
3195	320	3190	5	Severe hyperglycemia (>600 mg/dL)	f	\N	\N	\N
3196	320	\N	2	Oxygen saturation	f	\N	\N	\N
3197	320	3196	1	Value	t	Value	Enter value	\N
3198	320	3196	2	Hypoxemia (<92%)	f	\N	\N	\N
3199	320	\N	3	End-tidal CO2	f	\N	\N	\N
3200	320	3199	1	Value	t	Value	Enter value	\N
3201	320	3199	2	Hypercapnia (>45 mmHg)	f	\N	\N	\N
3202	320	3199	3	Hypocapnia (<35 mmHg)	f	\N	\N	\N
3203	321	\N	1	WBC	t	WBC	Enter wbc	\N
3204	321	3203	1	Leukocytosis (>11.0 x10^3/μL)	f	\N	\N	\N
3205	321	3203	2	Leukopenia (<4.0 x10^3/μL)	f	\N	\N	\N
3206	321	3203	3	Normal	f	\N	\N	\N
3207	321	\N	2	Hemoglobin	t	Hemoglobin	Enter hemoglobin	\N
3208	321	3207	1	Anemia (<12 g/dL)	f	\N	\N	\N
3209	321	3207	2	Severe anemia (<7 g/dL)	f	\N	\N	\N
3210	321	3207	3	Polycythemia (>16 g/dL)	f	\N	\N	\N
3211	321	3207	4	Normal	f	\N	\N	\N
3212	321	\N	3	Hematocrit	t	Hematocrit	Enter hematocrit	\N
3213	321	\N	4	Platelets	t	Platelets	Enter platelets	\N
3214	321	3213	1	Thrombocytopenia (<150 x10^3/μL)	f	\N	\N	\N
3215	321	3213	2	Severe thrombocytopenia (<50 x10^3/μL)	f	\N	\N	\N
3216	321	3213	3	Thrombocytosis (>450 x10^3/μL)	f	\N	\N	\N
3217	321	3213	4	Normal	f	\N	\N	\N
3218	321	\N	5	Differential	f	\N	\N	\N
3219	321	3218	1	Neutrophils	t	Neutrophils	Enter neutrophils	\N
3220	321	3218	2	Lymphocytes	t	Lymphocytes	Enter lymphocytes	\N
3221	321	3218	3	Monocytes	t	Monocytes	Enter monocytes	\N
3222	321	3218	4	Eosinophils	t	Eosinophils	Enter eosinophils	\N
3223	321	3218	5	Basophils	t	Basophils	Enter basophils	\N
3224	321	3218	6	Bands	t	Bands	Enter bands	\N
3225	322	\N	1	Sodium	t	Sodium	Enter sodium	\N
3226	322	3225	1	Hyponatremia (<135 mEq/L)	f	\N	\N	\N
3227	322	3225	2	Severe hyponatremia (<120 mEq/L)	f	\N	\N	\N
3228	322	3225	3	Hypernatremia (>145 mEq/L)	f	\N	\N	\N
3229	322	3225	4	Severe hypernatremia (>160 mEq/L)	f	\N	\N	\N
3230	322	3225	5	Normal	f	\N	\N	\N
3231	322	\N	2	Potassium	t	Potassium	Enter potassium	\N
3232	322	3231	1	Hypokalemia (<3.5 mEq/L)	f	\N	\N	\N
3233	322	3231	2	Hyperkalemia (>5.0 mEq/L)	f	\N	\N	\N
3234	322	3231	3	Normal	f	\N	\N	\N
3235	322	\N	3	Chloride	t	Chloride	Enter chloride	\N
3236	322	\N	4	Bicarbonate	t	Bicarbonate	Enter bicarbonate	\N
3237	322	3236	1	Metabolic acidosis (<22 mEq/L)	f	\N	\N	\N
3238	322	3236	2	Metabolic alkalosis (>29 mEq/L)	f	\N	\N	\N
3239	322	3236	3	Normal	f	\N	\N	\N
3240	322	\N	5	BUN	t	BUN	Enter bun	\N
3241	322	3240	1	Elevated (>20 mg/dL)	f	\N	\N	\N
3242	322	3240	2	Normal	f	\N	\N	\N
3243	322	\N	6	Creatinine	t	Creatinine	Enter creatinine	\N
3244	322	3243	1	Elevated (>1.2 mg/dL)	f	\N	\N	\N
3245	322	3243	2	Normal	f	\N	\N	\N
3246	322	\N	7	Glucose	t	Glucose	Enter glucose	\N
3247	322	\N	8	Calcium	t	Calcium	Enter calcium	\N
3248	322	3247	1	Hypocalcemia (<8.5 mg/dL)	f	\N	\N	\N
3249	322	3247	2	Hypercalcemia (>10.5 mg/dL)	f	\N	\N	\N
3250	322	3247	3	Normal	f	\N	\N	\N
3251	322	\N	9	Anion gap	t	Anion gap	Enter anion gap	\N
3252	322	3251	1	Elevated (>12 mEq/L)	f	\N	\N	\N
3253	322	3251	2	Normal	f	\N	\N	\N
3254	323	\N	1	AST	t	AST	Enter ast	\N
3255	323	\N	2	ALT	t	ALT	Enter alt	\N
3256	323	\N	3	Alkaline phosphatase	t	Alkaline phosphatase	Enter alkaline phosphatase	\N
3257	323	\N	4	Total bilirubin	t	Total bilirubin	Enter total bilirubin	\N
3258	323	\N	5	Direct bilirubin	t	Direct bilirubin	Enter direct bilirubin	\N
3259	323	\N	6	Albumin	t	Albumin	Enter albumin	\N
3260	323	\N	7	Total protein	t	Total protein	Enter total protein	\N
3261	323	\N	8	INR	t	INR	Enter inr	\N
3262	323	\N	9	PT	t	PT	Enter pt	\N
3263	323	\N	10	PTT	t	PTT	Enter ptt	\N
3264	324	\N	1	pH	t	pH	Enter ph	\N
3265	324	3264	1	Acidemia (<7.35)	f	\N	\N	\N
3266	324	3264	2	Alkalemia (>7.45)	f	\N	\N	\N
3267	324	3264	3	Normal	f	\N	\N	\N
3268	324	\N	2	PaO2	t	PaO2	Enter pao2	\N
3269	324	3268	1	Hypoxemia (<80 mmHg)	f	\N	\N	\N
3270	324	3268	2	Normal	f	\N	\N	\N
3271	324	\N	3	PaCO2	t	PaCO2	Enter paco2	\N
3272	324	3271	1	Hypercapnia (>45 mmHg)	f	\N	\N	\N
3273	324	3271	2	Hypocapnia (<35 mmHg)	f	\N	\N	\N
3274	324	3271	3	Normal	f	\N	\N	\N
3275	324	\N	4	HCO3	t	HCO3	Enter hco3	\N
3276	324	\N	5	Base excess/deficit	t	Base excess/deficit	Enter base excess/deficit	\N
3277	324	\N	6	Lactate	t	Lactate	Enter lactate	\N
3278	324	3277	1	Elevated (>2.0 mmol/L)	f	\N	\N	\N
3279	324	3277	2	Severely elevated (>4.0 mmol/L)	f	\N	\N	\N
3280	324	3277	3	Normal	f	\N	\N	\N
3281	324	\N	7	Carboxyhemoglobin	t	Carboxyhemoglobin	Enter carboxyhemoglobin	\N
3282	324	3281	1	Elevated (>3% nonsmoker, >10% smoker)	f	\N	\N	\N
3283	324	3281	2	Normal	f	\N	\N	\N
3284	324	\N	8	Methemoglobin	t	Methemoglobin	Enter methemoglobin	\N
3285	324	3284	1	Elevated (>1.5%)	f	\N	\N	\N
3286	324	3284	2	Normal	f	\N	\N	\N
3287	325	\N	1	Ethanol level	t	Ethanol level	Enter ethanol level	\N
3288	325	3287	1	Toxic (>300 mg/dL)	f	\N	\N	\N
3289	325	3287	2	Legal intoxication (>80 mg/dL)	f	\N	\N	\N
3290	325	3287	3	Present	f	\N	\N	\N
3291	325	3287	4	Not detected	f	\N	\N	\N
3292	325	\N	2	Acetaminophen level	t	Acetaminophen level	Enter acetaminophen level	\N
3293	325	3292	1	Toxic (per nomogram)	f	\N	\N	\N
3294	325	3292	2	Not detected	f	\N	\N	\N
3295	325	\N	3	Salicylate level	t	Salicylate level	Enter salicylate level	\N
3296	325	3295	1	Toxic (>30 mg/dL)	f	\N	\N	\N
3297	325	3295	2	Not detected	f	\N	\N	\N
3298	325	\N	4	Urine drug screen	f	\N	\N	\N
3299	325	3298	1	Amphetamines	f	\N	\N	\N
3300	325	3298	2	Barbiturates	f	\N	\N	\N
3301	325	3298	3	Benzodiazepines	f	\N	\N	\N
3302	325	3298	4	Cocaine	f	\N	\N	\N
3303	325	3298	5	Marijuana	f	\N	\N	\N
3304	325	3298	6	Opiates	f	\N	\N	\N
3305	325	3298	7	PCP	f	\N	\N	\N
3306	325	3298	8	Other	t	Other	Enter other	\N
3307	325	3298	9	Negative	f	\N	\N	\N
3308	325	\N	5	Specific drug levels	f	\N	\N	\N
3309	325	3308	1	Lithium	t	Lithium	Enter lithium	\N
3310	325	3308	2	Valproic acid	t	Valproic acid	Enter valproic acid	\N
3311	325	3308	3	Phenytoin	t	Phenytoin	Enter phenytoin	\N
3312	325	3308	4	Carbamazepine	t	Carbamazepine	Enter carbamazepine	\N
3313	325	3308	5	Other	t	Other	Enter other	\N
3314	326	\N	1	TSH	t	TSH	Enter tsh	\N
3315	326	\N	2	Free T4	t	Free T4	Enter free t4	\N
3316	326	\N	3	Cortisol	t	Cortisol	Enter cortisol	\N
3317	326	\N	4	Ammonia	t	Ammonia	Enter ammonia	\N
3318	326	3317	1	Elevated (>35 μmol/L)	f	\N	\N	\N
3319	326	3317	2	Normal	f	\N	\N	\N
3320	326	\N	5	Osmolality, measured	t	Osmolality, measured	Enter osmolality, measured	\N
3321	326	\N	6	Osmolality, calculated	t	Osmolality, calculated	Enter osmolality, calculated	\N
3322	326	\N	7	Osmolar gap	t	Osmolar gap	Enter osmolar gap	\N
3323	326	3322	1	Elevated (>10 mOsm/kg)	f	\N	\N	\N
3324	326	3322	2	Normal	f	\N	\N	\N
3325	327	\N	1	Blood cultures	f	\N	\N	\N
3326	327	3325	1	Collected	f	\N	\N	\N
3327	327	3325	2	Results	t	Results	Enter results	\N
3328	327	\N	2	Urine culture	f	\N	\N	\N
3329	327	3328	1	Collected	f	\N	\N	\N
3330	327	3328	2	Results	t	Results	Enter results	\N
3331	327	\N	3	Urinalysis	f	\N	\N	\N
3332	327	3331	1	Leukocyte esterase	f	\N	\N	\N
3333	327	3331	2	Nitrites	f	\N	\N	\N
3334	327	3331	3	WBCs	f	\N	\N	\N
3335	327	3331	4	Bacteria	f	\N	\N	\N
3336	327	3331	5	Results	t	Results	Enter results	\N
3337	327	\N	4	Cerebrospinal fluid analysis	f	\N	\N	\N
3338	327	3337	1	Opening pressure	t	Opening pressure	Enter opening pressure	\N
3339	327	3337	2	Appearance	t	Appearance	Enter appearance	\N
3340	327	3337	3	WBC	t	WBC	Enter wbc	\N
3341	327	3337	4	RBC	t	RBC	Enter rbc	\N
3342	327	3337	5	Glucose	t	Glucose	Enter glucose	\N
3343	327	3337	6	Protein	t	Protein	Enter protein	\N
3344	327	3337	7	Gram stain	t	Gram stain	Enter gram stain	\N
3345	327	3337	8	Culture	t	Culture	Enter culture	\N
3346	327	3337	9	HSV PCR	t	HSV PCR	Enter hsv pcr	\N
3347	327	3337	10	Other	t	Other	Enter other	\N
3348	327	\N	5	COVID-19 test	f	\N	\N	\N
3349	327	3348	1	Positive	f	\N	\N	\N
3350	327	3348	2	Negative	f	\N	\N	\N
3351	327	\N	6	Other infectious disease testing	f	\N	\N	\N
3352	327	3351	1	HIV	t	HIV	Enter hiv	\N
3353	327	3351	2	Respiratory viral panel	t	Respiratory viral panel	Enter respiratory viral panel	\N
3354	327	3351	3	Other	t	Other	Enter other	\N
3355	328	\N	1	ESR	t	ESR	Enter esr	\N
3356	328	\N	2	CRP	t	CRP	Enter crp	\N
3357	328	\N	3	Procalcitonin	t	Procalcitonin	Enter procalcitonin	\N
3358	328	\N	4	ANA	t	ANA	Enter ana	\N
3359	328	\N	5	Anti-dsDNA	t	Anti-dsDNA	Enter anti-dsdna	\N
3360	328	\N	6	ANCA	t	ANCA	Enter anca	\N
3361	328	\N	7	Other autoimmune markers	t	Other autoimmune markers	Enter other autoimmune markers	\N
3362	329	\N	1	Troponin	t	Troponin	Enter troponin	\N
3363	329	3362	1	Elevated	f	\N	\N	\N
3364	329	3362	2	Normal	f	\N	\N	\N
3365	329	\N	2	BNP/NT-proBNP	t	BNP/NT-proBNP	Enter bnp/nt-probnp	\N
3366	329	3365	1	Elevated	f	\N	\N	\N
3367	329	3365	2	Normal	f	\N	\N	\N
3368	329	\N	3	CK	t	CK	Enter ck	\N
3369	329	\N	4	CK-MB	t	CK-MB	Enter ck-mb	\N
3370	330	\N	1	Antiepileptic drugs	f	\N	\N	\N
3371	330	3370	1	Phenytoin/Fosphenytoin	f	\N	\N	\N
3372	330	3370	2	Carbamazepine	f	\N	\N	\N
3373	330	3370	3	Valproic acid	f	\N	\N	\N
3374	330	3370	4	Levetiracetam	f	\N	\N	\N
3375	330	3370	5	Lamotrigine	f	\N	\N	\N
3376	330	3370	6	Other	t	Other	Enter other	\N
3377	330	\N	2	Psychotropic medications	f	\N	\N	\N
3378	330	3377	1	Antipsychotics	f	\N	\N	\N
3379	330	3377	2	Antidepressants	f	\N	\N	\N
3380	330	3377	3	Lithium	f	\N	\N	\N
3381	330	3377	4	Anxiolytics	f	\N	\N	\N
3382	330	3377	5	Other	t	Other	Enter other	\N
3383	330	\N	3	Sedatives/Hypnotics	f	\N	\N	\N
3384	330	3383	1	Benzodiazepines	f	\N	\N	\N
3385	330	3383	2	Non-benzodiazepine sedatives	f	\N	\N	\N
3386	330	3383	3	Other	t	Other	Enter other	\N
3387	330	\N	4	Opioid analgesics	f	\N	\N	\N
3388	330	3387	1	Prescription opioids	f	\N	\N	\N
3389	330	3387	2	Methadone	f	\N	\N	\N
3390	330	3387	3	Buprenorphine	f	\N	\N	\N
3391	330	3387	4	Other	t	Other	Enter other	\N
3392	330	\N	5	Antihypertensives	f	\N	\N	\N
3393	330	3392	1	Beta blockers	f	\N	\N	\N
3394	330	3392	2	Calcium channel blockers	f	\N	\N	\N
3395	330	3392	3	ACE inhibitors/ARBs	f	\N	\N	\N
3396	330	3392	4	Clonidine	f	\N	\N	\N
3397	330	3392	5	Other	t	Other	Enter other	\N
3398	330	\N	6	Hypoglycemic agents	f	\N	\N	\N
3399	330	3398	1	Insulin	f	\N	\N	\N
3400	330	3398	2	Sulfonylureas	f	\N	\N	\N
3401	330	3398	3	Other	t	Other	Enter other	\N
3402	330	\N	7	Anticoagulants/Antiplatelets	f	\N	\N	\N
3403	330	3402	1	Warfarin	f	\N	\N	\N
3404	330	3402	2	Direct oral anticoagulants	f	\N	\N	\N
3405	330	3402	3	Antiplatelet agents	f	\N	\N	\N
3406	330	3402	4	Other	t	Other	Enter other	\N
3407	330	\N	8	Immunosuppressants	f	\N	\N	\N
3408	330	\N	9	Chemotherapeutic agents	f	\N	\N	\N
3409	330	\N	10	Hormone therapy	f	\N	\N	\N
3410	330	\N	11	Thyroid medications	f	\N	\N	\N
3411	330	\N	12	Steroids	f	\N	\N	\N
3412	330	\N	13	Other	t	Other	Enter other	\N
3413	331	\N	1	Recent medication changes	f	\N	\N	\N
3414	331	3413	1	Started within past week	t	Started within past week	Enter started within past week	\N
3415	331	3413	2	Discontinued within past week	t	Discontinued within past week	Enter discontinued within past week	\N
3416	331	3413	3	Dose adjustment within past week	t	Dose adjustment within past week	Enter dose adjustment within past week	\N
3417	331	\N	2	Non-adherence to prescribed regimen	f	\N	\N	\N
3418	331	\N	3	Medication errors	f	\N	\N	\N
3419	331	3418	1	Dosing error	f	\N	\N	\N
3420	331	3418	2	Frequency error	f	\N	\N	\N
3421	331	3418	3	Wrong medication	f	\N	\N	\N
3422	332	\N	1	Antihistamines	f	\N	\N	\N
3423	332	\N	2	NSAIDs	f	\N	\N	\N
3424	332	\N	3	Acetaminophen	f	\N	\N	\N
3425	332	\N	4	Cough/cold preparations	f	\N	\N	\N
3426	332	\N	5	Sleep aids	f	\N	\N	\N
3427	332	\N	6	Herbal supplements	f	\N	\N	\N
3428	332	\N	7	Vitamins/minerals	f	\N	\N	\N
3429	332	\N	8	Other	t	Other	Enter other	\N
3430	333	\N	1	Fully adherent to prescribed regimen	f	\N	\N	\N
3431	333	\N	2	Partially adherent	f	\N	\N	\N
3432	333	\N	3	Non-adherent	f	\N	\N	\N
3433	333	\N	4	Unknown adherence status	f	\N	\N	\N
3434	334	\N	1	Known medication allergies	t	Known medication allergies	Enter known medication allergies	\N
3435	334	\N	2	Previous adverse drug reactions	t	Previous adverse drug reactions	Enter previous adverse drug reactions	\N
3436	334	\N	3	Previous medication-related altered mental status	f	\N	\N	\N
3437	335	\N	1	Naloxone	f	\N	\N	\N
3438	335	3437	1	Response	t	Response	Enter response	\N
3439	335	\N	2	Dextrose/Glucose	f	\N	\N	\N
3440	335	3439	1	Response	t	Response	Enter response	\N
3441	335	\N	3	Thiamine	f	\N	\N	\N
3442	335	\N	4	Flumazenil	f	\N	\N	\N
3443	335	\N	5	Antiepileptic agents	f	\N	\N	\N
3444	335	\N	6	Other	t	Other	Enter other	\N
3445	336	\N	1	Previous stroke/TIA (I63.9, G45.9)	f	\N	\N	\N
3446	336	3445	1	Date(s)	t	Date(s)	Enter date(s)	\N
3447	336	3445	2	Territory	t	Territory	Enter territory	\N
3448	336	3445	3	Residual deficits	t	Residual deficits	Enter residual deficits	\N
3449	336	\N	2	Seizure disorder (G40.909)	f	\N	\N	\N
3450	336	3449	1	Type	t	Type	Enter type	\N
3451	336	3449	2	Last seizure	t	Last seizure	Enter last seizure	\N
3452	336	3449	3	Typical presentation	t	Typical presentation	Enter typical presentation	\N
3453	336	\N	3	Traumatic brain injury (S06.9XXA)	f	\N	\N	\N
3454	336	3453	1	Date	t	Date	Enter date	\N
3455	336	3453	2	Severity	t	Severity	Enter severity	\N
3456	336	\N	4	Dementia (F03)	f	\N	\N	\N
3457	336	3456	1	Type	t	Type	Enter type	\N
3458	336	3456	2	Progression	t	Progression	Enter progression	\N
3459	336	\N	5	Movement disorder (G25.9)	f	\N	\N	\N
3460	336	3459	1	Type	t	Type	Enter type	\N
3461	336	\N	6	Migraine (G43.909)	f	\N	\N	\N
3462	336	\N	7	Multiple sclerosis (G35)	f	\N	\N	\N
3463	336	\N	8	Parkinson's disease (G20)	f	\N	\N	\N
3464	336	\N	9	Intracranial tumor (D43.2)	f	\N	\N	\N
3465	336	3464	1	Type	t	Type	Enter type	\N
3466	336	3464	2	Treatment	t	Treatment	Enter treatment	\N
3467	336	\N	10	Neurosurgical procedures	f	\N	\N	\N
3468	336	3467	1	Type	t	Type	Enter type	\N
3469	336	3467	2	Date	t	Date	Enter date	\N
3470	336	\N	11	Other neurological conditions	t	Other neurological conditions	Enter other neurological conditions	\N
3471	337	\N	1	Hypertension (I10)	f	\N	\N	\N
3472	337	3471	1	Duration	t	Duration	Enter duration	\N
3473	337	3471	2	Control	t	Control	Enter control	\N
3474	337	\N	2	Coronary artery disease (I25.10)	f	\N	\N	\N
3475	337	3474	1	History of MI (I21.9)	f	\N	\N	\N
3476	337	3474	2	Date(s)	t	Date(s)	Enter date(s)	\N
3477	337	\N	3	Heart failure (I50.9)	f	\N	\N	\N
3478	337	3477	1	EF	t	EF	Enter ef	\N
3479	337	3477	2	NYHA class	t	NYHA class	Enter nyha class	\N
3480	337	\N	4	Atrial fibrillation (I48.91)	f	\N	\N	\N
3481	337	3480	1	Paroxysmal/Persistent/Permanent	f	\N	\N	\N
3482	337	3480	2	Anticoagulation	t	Anticoagulation	Enter anticoagulation	\N
3483	337	\N	5	Valvular heart disease (I38)	f	\N	\N	\N
3484	337	3483	1	Type	t	Type	Enter type	\N
3485	337	\N	6	Peripheral vascular disease (I73.9)	f	\N	\N	\N
3486	337	\N	7	Carotid artery stenosis (I65.29)	f	\N	\N	\N
3487	337	3486	1	Degree	t	Degree	Enter degree	\N
3488	337	\N	8	Venous thromboembolism (I82.90)	f	\N	\N	\N
3489	337	3488	1	PE (I26.99)	f	\N	\N	\N
3490	337	3488	2	DVT (I82.409)	f	\N	\N	\N
3491	337	3488	3	Date(s)	t	Date(s)	Enter date(s)	\N
3492	337	\N	9	Cardiac arrest (I46.9)	f	\N	\N	\N
3493	337	3492	1	Date	t	Date	Enter date	\N
3494	337	3492	2	Cause	t	Cause	Enter cause	\N
3495	337	\N	10	Cardiac procedures	f	\N	\N	\N
3496	337	3495	1	Type	t	Type	Enter type	\N
3497	337	3495	2	Date	t	Date	Enter date	\N
3498	337	\N	11	Other cardiovascular conditions	t	Other cardiovascular conditions	Enter other cardiovascular conditions	\N
3499	338	\N	1	Asthma (J45.909)	f	\N	\N	\N
3500	338	\N	2	COPD (J44.9)	f	\N	\N	\N
3501	338	\N	3	Obstructive sleep apnea (G47.33)	f	\N	\N	\N
3502	338	3501	1	Treatment	t	Treatment	Enter treatment	\N
3503	338	\N	4	Pulmonary embolism (I26.99)	f	\N	\N	\N
3504	338	\N	5	Pulmonary hypertension (I27.0)	f	\N	\N	\N
3505	338	\N	6	Interstitial lung disease (J84.9)	f	\N	\N	\N
3506	338	\N	7	Tuberculosis (A15.9)	f	\N	\N	\N
3507	338	\N	8	Other pulmonary conditions	t	Other pulmonary conditions	Enter other pulmonary conditions	\N
3508	339	\N	1	Diabetes mellitus	f	\N	\N	\N
3509	339	3508	1	Type 1 (E10.9)	f	\N	\N	\N
3510	339	3508	2	Type 2 (E11.9)	f	\N	\N	\N
3511	339	3508	3	Duration	t	Duration	Enter duration	\N
3512	339	3508	4	Complications	t	Complications	Enter complications	\N
3513	339	\N	2	Thyroid disease	f	\N	\N	\N
3514	339	3513	1	Hypothyroidism (E03.9)	f	\N	\N	\N
3515	339	3513	2	Hyperthyroidism (E05.90)	f	\N	\N	\N
3516	339	\N	3	Adrenal disorder (E27.9)	f	\N	\N	\N
3517	339	\N	4	Pituitary disorder (E23.7)	f	\N	\N	\N
3518	339	\N	5	Other endocrine conditions	t	Other endocrine conditions	Enter other endocrine conditions	\N
3519	340	\N	1	Chronic kidney disease (N18.9)	f	\N	\N	\N
3520	340	3519	1	Stage	t	Stage	Enter stage	\N
3521	340	3519	2	Cause	t	Cause	Enter cause	\N
3522	340	\N	2	End-stage renal disease (N18.6)	f	\N	\N	\N
3523	340	3522	1	Dialysis	t	Dialysis	Enter dialysis	\N
3524	340	\N	3	Nephrolithiasis (N20.9)	f	\N	\N	\N
3525	340	\N	4	Other renal conditions	t	Other renal conditions	Enter other renal conditions	\N
3526	341	\N	1	Cirrhosis (K74.60)	f	\N	\N	\N
3527	341	3526	1	Cause	t	Cause	Enter cause	\N
3528	341	3526	2	Complications	t	Complications	Enter complications	\N
3529	341	\N	2	Hepatitis (K75.9)	f	\N	\N	\N
3530	341	3529	1	Type	t	Type	Enter type	\N
3531	341	\N	3	Fatty liver disease (K76.0)	f	\N	\N	\N
3532	341	\N	4	Other hepatic conditions	t	Other hepatic conditions	Enter other hepatic conditions	\N
3533	342	\N	1	Peptic ulcer disease (K27.9)	f	\N	\N	\N
3534	342	\N	2	Inflammatory bowel disease (K50.90, K51.90)	f	\N	\N	\N
3535	342	\N	3	GERD (K21.9)	f	\N	\N	\N
3536	342	\N	4	Diverticular disease (K57.90)	f	\N	\N	\N
3537	342	\N	5	GI bleeding (K92.2)	f	\N	\N	\N
3538	342	\N	6	Other GI conditions	t	Other GI conditions	Enter other gi conditions	\N
3539	343	\N	1	Anemia (D64.9)	f	\N	\N	\N
3540	343	3539	1	Type	t	Type	Enter type	\N
3541	343	\N	2	Bleeding disorder (D69.9)	f	\N	\N	\N
3542	343	3541	1	Type	t	Type	Enter type	\N
3543	343	\N	3	Thrombophilia (D68.9)	f	\N	\N	\N
3544	343	3543	1	Type	t	Type	Enter type	\N
3545	343	\N	4	Malignancy (C80.1)	f	\N	\N	\N
3546	343	3545	1	Type	t	Type	Enter type	\N
3547	343	3545	2	Treatment	t	Treatment	Enter treatment	\N
3548	343	3545	3	Status	t	Status	Enter status	\N
3549	343	\N	5	Other hematologic conditions	t	Other hematologic conditions	Enter other hematologic conditions	\N
3550	344	\N	1	HIV/AIDS (B20)	f	\N	\N	\N
3551	344	3550	1	CD4 count	t	CD4 count	Enter cd4 count	\N
3552	344	3550	2	Treatment	t	Treatment	Enter treatment	\N
3553	344	\N	2	Meningitis/Encephalitis (G03.9)	f	\N	\N	\N
3554	344	\N	3	Tuberculosis (A15.9)	f	\N	\N	\N
3555	344	\N	4	Endocarditis (I33.9)	f	\N	\N	\N
3556	344	\N	5	Sepsis (A41.9)	f	\N	\N	\N
3557	344	\N	6	Other infectious diseases	t	Other infectious diseases	Enter other infectious diseases	\N
3558	345	\N	1	Major depressive disorder (F32.9)	f	\N	\N	\N
3559	345	\N	2	Bipolar disorder (F31.9)	f	\N	\N	\N
3560	345	\N	3	Schizophrenia (F20.9)	f	\N	\N	\N
3561	345	\N	4	Anxiety disorder (F41.9)	f	\N	\N	\N
3562	345	\N	5	PTSD (F43.10)	f	\N	\N	\N
3563	345	\N	6	Substance use disorder (F19.20)	f	\N	\N	\N
3564	345	3563	1	Type	t	Type	Enter type	\N
3565	345	\N	7	Previous suicide attempts (T14.91)	f	\N	\N	\N
3566	345	\N	8	Other psychiatric conditions	t	Other psychiatric conditions	Enter other psychiatric conditions	\N
3567	346	\N	1	Brain surgery	t	Brain surgery	Enter brain surgery	\N
3568	346	\N	2	Spine surgery	t	Spine surgery	Enter spine surgery	\N
3569	346	\N	3	Cardiac surgery	t	Cardiac surgery	Enter cardiac surgery	\N
3570	346	\N	4	Vascular surgery	t	Vascular surgery	Enter vascular surgery	\N
3571	346	\N	5	Abdominal surgery	t	Abdominal surgery	Enter abdominal surgery	\N
3572	346	\N	6	Orthopedic surgery	t	Orthopedic surgery	Enter orthopedic surgery	\N
3573	346	\N	7	Other surgeries	t	Other surgeries	Enter other surgeries	\N
3574	347	\N	1	Diagnosis explained to:	f	\N	\N	\N
3575	347	3574	1	Patient	f	\N	\N	\N
3576	347	3574	2	Family/caregiver	f	\N	\N	\N
3577	347	3574	3	Healthcare proxy	f	\N	\N	\N
3578	347	\N	2	Materials provided:	f	\N	\N	\N
3579	347	3578	1	Verbal explanation	f	\N	\N	\N
3580	347	3578	2	Written materials	f	\N	\N	\N
3581	347	3578	3	Video resources	f	\N	\N	\N
3582	347	3578	4	Online resources	f	\N	\N	\N
3583	347	\N	3	Understanding assessed:	f	\N	\N	\N
3584	347	3583	1	Complete understanding	f	\N	\N	\N
3585	347	3583	2	Partial understanding	f	\N	\N	\N
3586	347	3583	3	Limited understanding	f	\N	\N	\N
3587	347	3583	4	Unable to assess	f	\N	\N	\N
3588	347	\N	4	Topics covered:	f	\N	\N	\N
3589	347	3588	1	Disease process	f	\N	\N	\N
3590	347	3588	2	Cause/etiology	f	\N	\N	\N
3591	347	3588	3	Expected course	f	\N	\N	\N
3592	347	3588	4	Potential complications	f	\N	\N	\N
3593	347	3588	5	Prognosis	f	\N	\N	\N
3594	347	3588	6	Other	t	Other	Enter other	\N
3595	348	\N	1	Treatment plan explained	f	\N	\N	\N
3596	348	3595	1	Current treatments	f	\N	\N	\N
3597	348	3595	2	Future treatments	f	\N	\N	\N
3598	348	3595	3	Treatment alternatives	f	\N	\N	\N
3599	348	3595	4	Risks and benefits	f	\N	\N	\N
3600	348	\N	2	Medication education	f	\N	\N	\N
3601	348	3600	1	New medications	f	\N	\N	\N
3602	348	3601	1	Name	f	\N	\N	\N
3603	348	3601	2	Purpose	f	\N	\N	\N
3604	348	3601	3	Dosage	f	\N	\N	\N
3605	348	3601	4	Schedule	f	\N	\N	\N
3606	348	3601	5	Side effects	f	\N	\N	\N
3607	348	3601	6	Special instructions	f	\N	\N	\N
3608	348	3600	2	Medication changes	f	\N	\N	\N
3609	348	3600	3	Medications to avoid	f	\N	\N	\N
3610	348	3600	4	Importance of adherence	f	\N	\N	\N
3611	348	\N	3	Procedure education	f	\N	\N	\N
3612	348	3611	1	Purpose	f	\N	\N	\N
3613	348	3611	2	Process	f	\N	\N	\N
3614	348	3611	3	Risks and benefits	f	\N	\N	\N
3615	348	3611	4	Alternatives	f	\N	\N	\N
3616	348	3611	5	Post-procedure care	f	\N	\N	\N
3617	348	\N	4	Rehabilitation plan	f	\N	\N	\N
3618	348	3617	1	Purpose	f	\N	\N	\N
3619	348	3617	2	Expected duration	f	\N	\N	\N
3620	348	3617	3	Patient's role	f	\N	\N	\N
3621	348	3617	4	Home exercises	f	\N	\N	\N
3622	349	\N	1	Warning signs requiring immediate attention:	f	\N	\N	\N
3623	349	3622	1	Worsening neurological symptoms	f	\N	\N	\N
3624	349	3622	2	New neurological symptoms	f	\N	\N	\N
3625	349	3622	3	Severe headache	f	\N	\N	\N
3626	349	3622	4	Seizure	f	\N	\N	\N
3627	349	3622	5	Fever	f	\N	\N	\N
3628	349	3622	6	Other	t	Other	Enter other	\N
3629	349	\N	2	Action plan for emergency:	f	\N	\N	\N
3630	349	3629	1	Call 911	f	\N	\N	\N
3631	349	3629	2	Go to emergency department	f	\N	\N	\N
3632	349	3629	3	Contact provider	f	\N	\N	\N
3633	349	\N	3	Non-urgent concerns requiring follow-up:	f	\N	\N	\N
3634	349	3633	1	Symptoms	t	Symptoms	Enter symptoms	\N
3635	349	3633	2	Action	t	Action	Enter action	\N
3636	350	\N	1	Activity restrictions	f	\N	\N	\N
3637	350	3636	1	Driving	f	\N	\N	\N
3638	350	3636	2	Work	f	\N	\N	\N
3639	350	3636	3	Physical activity	f	\N	\N	\N
3855	365	\N	1	Mental Status	f	\N	\N	\N
3640	350	3636	4	Duration of restrictions	t	Duration of restrictions	Enter duration of restrictions	\N
3641	350	\N	2	Diet recommendations	f	\N	\N	\N
3642	350	3641	1	Specific diet	t	Specific diet	Enter specific diet	\N
3643	350	3641	2	Sodium restriction	f	\N	\N	\N
3644	350	3641	3	Fluid restriction/requirements	f	\N	\N	\N
3645	350	3641	4	Other	t	Other	Enter other	\N
3646	350	\N	3	Risk factor modification	f	\N	\N	\N
3647	350	3646	1	Smoking cessation	f	\N	\N	\N
3648	350	3646	2	Alcohol reduction/abstinence	f	\N	\N	\N
3649	350	3646	3	Substance use avoidance	f	\N	\N	\N
3650	350	3646	4	Blood pressure control	f	\N	\N	\N
3651	350	3646	5	Diabetes management	f	\N	\N	\N
3652	350	3646	6	Cholesterol management	f	\N	\N	\N
3653	350	3646	7	Weight management	f	\N	\N	\N
3654	350	3646	8	Stress reduction	f	\N	\N	\N
3655	350	3646	9	Sleep hygiene	f	\N	\N	\N
3656	350	3646	10	Other	t	Other	Enter other	\N
3657	351	\N	1	Medication management	f	\N	\N	\N
3658	351	3657	1	Medication calendar/schedule	f	\N	\N	\N
3659	351	3657	2	Pill organizer	f	\N	\N	\N
3660	351	3657	3	Medication reminders	f	\N	\N	\N
3661	351	\N	2	Neurological self-monitoring	f	\N	\N	\N
3662	351	3661	1	Seizure diary	f	\N	\N	\N
3663	351	3661	2	Symptom log	f	\N	\N	\N
3664	351	3661	3	Blood pressure monitoring	f	\N	\N	\N
3665	351	3661	4	Blood glucose monitoring	f	\N	\N	\N
3666	351	\N	3	Home safety measures	f	\N	\N	\N
3667	351	3666	1	Fall prevention	f	\N	\N	\N
3668	351	3666	2	Seizure precautions	f	\N	\N	\N
3669	351	3666	3	Bathroom safety	f	\N	\N	\N
3670	351	3666	4	Other	t	Other	Enter other	\N
3671	351	\N	4	Activity resumption guidelines	f	\N	\N	\N
3672	351	3671	1	Gradual return to activities	f	\N	\N	\N
3673	351	3671	2	Pacing strategies	f	\N	\N	\N
3674	351	3671	3	Energy conservation techniques	f	\N	\N	\N
3675	352	\N	1	Support services	f	\N	\N	\N
3676	352	3675	1	Support groups	f	\N	\N	\N
3677	352	3675	2	Counseling services	f	\N	\N	\N
3678	352	3675	3	Case management	f	\N	\N	\N
3679	352	3675	4	Social work	f	\N	\N	\N
3680	352	3675	5	Home health	f	\N	\N	\N
3681	352	3675	6	Other	t	Other	Enter other	\N
3682	352	\N	2	Educational resources	f	\N	\N	\N
3683	352	3682	1	Websites	f	\N	\N	\N
3684	352	3682	2	Books	f	\N	\N	\N
3685	352	3682	3	Videos	f	\N	\N	\N
3686	352	3682	4	Apps	f	\N	\N	\N
3687	352	3682	5	Other	t	Other	Enter other	\N
3688	352	\N	3	Community resources	f	\N	\N	\N
3689	352	3688	1	Transportation	f	\N	\N	\N
3690	352	3688	2	Meal services	f	\N	\N	\N
3691	352	3688	3	Financial assistance	f	\N	\N	\N
3692	352	3688	4	Other	t	Other	Enter other	\N
3693	352	\N	4	Caregiver resources	f	\N	\N	\N
3694	352	3693	1	Respite care	f	\N	\N	\N
3695	352	3693	2	Training resources	f	\N	\N	\N
3696	352	3693	3	Support groups	f	\N	\N	\N
3697	352	3693	4	Other	t	Other	Enter other	\N
3698	353	\N	1	Appointments	f	\N	\N	\N
3699	353	3698	1	Provider	t	Provider	Enter provider	\N
3700	353	3698	2	Date/time	t	Date/time	Enter date/time	\N
3701	353	3698	3	Location	t	Location	Enter location	\N
3702	353	3698	4	Purpose	t	Purpose	Enter purpose	\N
3703	353	\N	2	Testing	f	\N	\N	\N
3704	353	3703	1	Test	t	Test	Enter test	\N
3705	353	3703	2	Date/time	t	Date/time	Enter date/time	\N
3706	353	3703	3	Location	t	Location	Enter location	\N
3707	353	3703	4	Preparation instructions	t	Preparation instructions	Enter preparation instructions	\N
3708	353	\N	3	When to contact healthcare provider	f	\N	\N	\N
3709	353	3708	1	Symptoms	t	Symptoms	Enter symptoms	\N
3710	353	3708	2	Questions about medications	f	\N	\N	\N
3711	353	3708	3	Other concerns	t	Other concerns	Enter other concerns	\N
3712	353	\N	4	Provider contact information	f	\N	\N	\N
3713	353	3712	1	Primary provider	t	Primary provider	Enter primary provider	\N
3714	353	3712	2	Specialist	t	Specialist	Enter specialist	\N
3715	353	3712	3	After-hours contact	t	After-hours contact	Enter after-hours contact	\N
3716	354	\N	1	Education documented in medical record	f	\N	\N	\N
3717	354	\N	2	Copy of instructions provided to patient/family	f	\N	\N	\N
3718	354	\N	3	Interpreter services used (if applicable)	f	\N	\N	\N
3719	354	\N	4	Teach-back method used to confirm understanding	f	\N	\N	\N
3720	354	\N	5	Patient/family questions addressed	f	\N	\N	\N
3721	355	\N	1	Temperature	t	Temperature	Enter temperature	\N
3722	355	\N	2	Heart rate	t	Heart rate	Enter heart rate	\N
3723	355	\N	3	Respiratory rate	t	Respiratory rate	Enter respiratory rate	\N
3724	355	\N	4	Blood pressure	t	Blood pressure	Enter blood pressure	\N
3725	355	\N	5	Oxygen saturation	t	Oxygen saturation	Enter oxygen saturation	\N
3726	355	\N	6	End-tidal CO2	t	End-tidal CO2	Enter end-tidal co2	\N
3727	355	\N	7	Pain score	t	Pain score	Enter pain score	\N
3728	356	\N	1	Alert	f	\N	\N	\N
3729	356	\N	2	Lethargic	f	\N	\N	\N
3730	356	\N	3	Stuporous	f	\N	\N	\N
3731	356	\N	4	Comatose	f	\N	\N	\N
3732	356	\N	5	Diaphoretic	f	\N	\N	\N
3733	356	\N	6	Cachexic	f	\N	\N	\N
3734	356	\N	7	Distressed	f	\N	\N	\N
3735	356	\N	8	Well-nourished	f	\N	\N	\N
3736	356	\N	9	Well-developed	f	\N	\N	\N
3737	356	\N	10	Disheveled	f	\N	\N	\N
3738	356	\N	11	Pallor	f	\N	\N	\N
3739	356	\N	12	Cyanosis	f	\N	\N	\N
3740	356	\N	13	Jaundice	f	\N	\N	\N
3741	357	\N	1	Eye opening	t	Eye opening	Enter eye opening	\N
3742	357	\N	2	Verbal response	t	Verbal response	Enter verbal response	\N
3743	357	\N	3	Motor response	t	Motor response	Enter motor response	\N
3744	357	\N	4	Total GCS	t	Total GCS	Enter total gcs	\N
3745	358	\N	1	Eye response	t	Eye response	Enter eye response	\N
3746	358	\N	2	Motor response	t	Motor response	Enter motor response	\N
3747	358	\N	3	Brainstem reflexes	t	Brainstem reflexes	Enter brainstem reflexes	\N
3748	358	\N	4	Respiration	t	Respiration	Enter respiration	\N
3749	358	\N	5	Total FOUR score	t	Total FOUR score	Enter total four score	\N
3750	359	\N	1	Head trauma	f	\N	\N	\N
3751	359	3750	1	Hematoma	f	\N	\N	\N
3752	359	3750	2	Laceration	f	\N	\N	\N
3753	359	3750	3	Contusion	f	\N	\N	\N
3754	359	3750	4	Battle's sign	f	\N	\N	\N
3755	359	3750	5	Raccoon eyes	f	\N	\N	\N
3756	359	\N	2	Pupils	f	\N	\N	\N
3757	359	3756	1	Size (mm): Right _____ Left _____	f	\N	\N	\N
3758	359	3756	2	Reactivity: Right _____ Left _____	f	\N	\N	\N
3759	359	3756	3	PERRLA	f	\N	\N	\N
3760	359	3756	4	Anisocoria	f	\N	\N	\N
3761	359	3756	5	Pinpoint	f	\N	\N	\N
3762	359	3756	6	Dilated	f	\N	\N	\N
3763	359	3756	7	Sluggish	f	\N	\N	\N
3764	359	3756	8	Fixed	f	\N	\N	\N
3765	359	\N	3	Extraocular movements	f	\N	\N	\N
3766	359	3765	1	Full	f	\N	\N	\N
3767	359	3765	2	Limited	f	\N	\N	\N
3768	359	3765	3	Dysconjugate gaze	f	\N	\N	\N
3769	359	3765	4	Nystagmus	f	\N	\N	\N
3770	359	3765	5	Eye deviation	t	Eye deviation	Enter eye deviation	\N
3771	359	\N	4	Fundoscopic exam	f	\N	\N	\N
3772	359	3771	1	Papilledema	f	\N	\N	\N
3773	359	3771	2	Retinal hemorrhages	f	\N	\N	\N
3774	359	3771	3	Subhyaloid hemorrhage	f	\N	\N	\N
3775	359	\N	5	Ears	f	\N	\N	\N
3776	359	3775	1	Hemotympanum	f	\N	\N	\N
3777	359	3775	2	Otorrhea	f	\N	\N	\N
3778	359	\N	6	Nose	f	\N	\N	\N
3779	359	3778	1	Rhinorrhea	f	\N	\N	\N
3780	359	\N	7	Oropharynx	f	\N	\N	\N
3781	359	3780	1	Tongue laceration	f	\N	\N	\N
3782	359	3780	2	Mucous membranes	f	\N	\N	\N
3783	359	3782	1	Moist	f	\N	\N	\N
3784	359	3782	2	Dry	f	\N	\N	\N
3785	360	\N	1	Nuchal rigidity	f	\N	\N	\N
3786	360	\N	2	Brudzinski sign	f	\N	\N	\N
3787	360	\N	3	Kernig sign	f	\N	\N	\N
3788	360	\N	4	Carotid bruits	f	\N	\N	\N
3789	360	\N	5	JVD	f	\N	\N	\N
3790	360	\N	6	Tracheal deviation	f	\N	\N	\N
3791	360	\N	7	Thyromegaly	f	\N	\N	\N
3792	360	\N	8	C-spine tenderness	f	\N	\N	\N
3793	361	\N	1	Regular rate and rhythm	f	\N	\N	\N
3794	361	\N	2	Irregular rhythm	f	\N	\N	\N
3795	361	\N	3	Tachycardia	f	\N	\N	\N
3796	361	\N	4	Bradycardia	f	\N	\N	\N
3797	361	\N	5	Murmur	f	\N	\N	\N
3798	361	3797	1	Description	t	Description	Enter description	\N
3799	361	\N	6	S3 gallop	f	\N	\N	\N
3800	361	\N	7	S4 gallop	f	\N	\N	\N
3801	361	\N	8	Rub	f	\N	\N	\N
3802	361	\N	9	Edema	f	\N	\N	\N
3803	361	3802	1	Location	t	Location	Enter location	\N
3804	361	3802	2	Severity	t	Severity	Enter severity	\N
3805	362	\N	1	Respiratory pattern	f	\N	\N	\N
3806	362	3805	1	Regular	f	\N	\N	\N
3807	362	3805	2	Irregular	f	\N	\N	\N
3808	362	3805	3	Cheyne-Stokes	f	\N	\N	\N
3809	362	3805	4	Kussmaul	f	\N	\N	\N
3810	362	3805	5	Ataxic	f	\N	\N	\N
3811	362	3805	6	Apneustic	f	\N	\N	\N
3812	362	\N	2	Breath sounds	f	\N	\N	\N
3813	362	3812	1	Clear bilaterally	f	\N	\N	\N
3814	362	3812	2	Crackles	f	\N	\N	\N
3815	362	3812	3	Wheezes	f	\N	\N	\N
3816	362	3812	4	Rhonchi	f	\N	\N	\N
3817	362	3812	5	Rales	f	\N	\N	\N
3818	362	3812	6	Diminished	f	\N	\N	\N
3819	362	\N	3	Accessory muscle use	f	\N	\N	\N
3820	362	\N	4	Stridor	f	\N	\N	\N
3821	362	\N	5	Cough	f	\N	\N	\N
3822	363	\N	1	Soft	f	\N	\N	\N
3823	363	\N	2	Distended	f	\N	\N	\N
3824	363	\N	3	Tender	f	\N	\N	\N
3825	363	3824	1	Location	t	Location	Enter location	\N
3826	363	\N	4	Hepatomegaly	f	\N	\N	\N
3827	363	\N	5	Splenomegaly	f	\N	\N	\N
3828	363	\N	6	Ascites	f	\N	\N	\N
3829	363	\N	7	Bowel sounds	f	\N	\N	\N
3830	363	3829	1	Normal	f	\N	\N	\N
3831	363	3829	2	Hyperactive	f	\N	\N	\N
3832	363	3829	3	Hypoactive	f	\N	\N	\N
3833	363	3829	4	Absent	f	\N	\N	\N
3834	364	\N	1	Color	f	\N	\N	\N
3835	364	3834	1	Normal	f	\N	\N	\N
3836	364	3834	2	Pale	f	\N	\N	\N
3837	364	3834	3	Cyanotic	f	\N	\N	\N
3838	364	3834	4	Jaundiced	f	\N	\N	\N
3839	364	3834	5	Flushed	f	\N	\N	\N
3840	364	3834	6	Mottled	f	\N	\N	\N
3841	364	\N	2	Temperature	f	\N	\N	\N
3842	364	3841	1	Warm	f	\N	\N	\N
3843	364	3841	2	Cool	f	\N	\N	\N
3844	364	3841	3	Hot	f	\N	\N	\N
3845	364	3841	4	Diaphoretic	f	\N	\N	\N
3846	364	\N	3	Rash	f	\N	\N	\N
3847	364	3846	1	Description	t	Description	Enter description	\N
3848	364	3846	2	Distribution	t	Distribution	Enter distribution	\N
3849	364	\N	4	Petechiae	f	\N	\N	\N
3850	364	\N	5	Purpura	f	\N	\N	\N
3851	364	\N	6	Needle track marks	f	\N	\N	\N
3852	364	\N	7	Medicinal patches	f	\N	\N	\N
3853	364	\N	8	Spider angiomata	f	\N	\N	\N
3854	364	\N	9	Palmar erythema	f	\N	\N	\N
3856	365	3855	1	Orientation	f	\N	\N	\N
3857	365	3856	1	Person	f	\N	\N	\N
3858	365	3856	2	Place	f	\N	\N	\N
3859	365	3856	3	Time	f	\N	\N	\N
3860	365	3856	4	Situation	f	\N	\N	\N
3861	365	3855	2	Attention	f	\N	\N	\N
3862	365	3855	3	Memory	f	\N	\N	\N
3863	365	3855	4	Language	f	\N	\N	\N
3864	365	3863	1	Fluent	f	\N	\N	\N
3865	365	3863	2	Non-fluent	f	\N	\N	\N
3866	365	3863	3	Aphasic	f	\N	\N	\N
3867	365	\N	2	Cranial Nerves	f	\N	\N	\N
3868	365	3867	1	CN I (smell)	f	\N	\N	\N
3869	365	3867	2	CN II (visual acuity, fields)	f	\N	\N	\N
3870	365	3867	3	CN III, IV, VI (pupils, EOMs)	f	\N	\N	\N
3871	365	3867	4	CN V (facial sensation, jaw strength)	f	\N	\N	\N
3872	365	3867	5	CN VII (facial symmetry)	f	\N	\N	\N
3873	365	3867	6	CN VIII (hearing)	f	\N	\N	\N
3874	365	3867	7	CN IX, X (palate, gag)	f	\N	\N	\N
3875	365	3867	8	CN XI (SCM, trapezius strength)	f	\N	\N	\N
3876	365	3867	9	CN XII (tongue)	f	\N	\N	\N
3877	365	\N	3	Motor Exam	f	\N	\N	\N
3878	365	3877	1	Tone	f	\N	\N	\N
3879	365	3878	1	Normal	f	\N	\N	\N
3880	365	3878	2	Increased	f	\N	\N	\N
3881	365	3878	3	Decreased	f	\N	\N	\N
3882	365	3878	4	Rigidity	f	\N	\N	\N
3883	365	3877	2	Strength (0-5/5)	f	\N	\N	\N
3884	365	3883	1	Right arm	t	Right arm	Enter right arm	\N
3885	365	3883	2	Left arm	t	Left arm	Enter left arm	\N
3886	365	3883	3	Right leg	t	Right leg	Enter right leg	\N
3887	365	3883	4	Left leg	t	Left leg	Enter left leg	\N
3888	365	3877	3	Abnormal movements	f	\N	\N	\N
3889	365	3888	1	Tremor	f	\N	\N	\N
3890	365	3888	2	Myoclonus	f	\N	\N	\N
3891	365	3888	3	Asterixis	f	\N	\N	\N
3892	365	3888	4	Chorea	f	\N	\N	\N
3893	365	3888	5	Dystonia	f	\N	\N	\N
3894	365	\N	4	Reflexes (0-4+)	f	\N	\N	\N
3895	365	3894	1	Biceps: R_____ L_____	f	\N	\N	\N
3896	365	3894	2	Triceps: R_____ L_____	f	\N	\N	\N
3897	365	3894	3	Brachioradialis: R_____ L_____	f	\N	\N	\N
3898	365	3894	4	Patellar: R_____ L_____	f	\N	\N	\N
3899	365	3894	5	Achilles: R_____ L_____	f	\N	\N	\N
3900	365	3894	6	Babinski: R_____ L_____	f	\N	\N	\N
3901	365	3894	7	Clonus: R_____ L_____	f	\N	\N	\N
3902	365	\N	5	Sensation	f	\N	\N	\N
3903	365	3902	1	Light touch	f	\N	\N	\N
3904	365	3902	2	Pain	f	\N	\N	\N
3905	365	3902	3	Temperature	f	\N	\N	\N
3906	365	3902	4	Vibration	f	\N	\N	\N
3907	365	3902	5	Proprioception	f	\N	\N	\N
3908	365	\N	6	Coordination	f	\N	\N	\N
3909	365	3908	1	Finger-to-nose	f	\N	\N	\N
3910	365	3908	2	Heel-to-shin	f	\N	\N	\N
3911	365	3908	3	Rapid alternating movements	f	\N	\N	\N
3912	365	\N	7	Gait	f	\N	\N	\N
3913	365	3912	1	Normal	f	\N	\N	\N
3914	365	3912	2	Ataxic	f	\N	\N	\N
3915	365	3912	3	Apraxic	f	\N	\N	\N
3916	365	3912	4	Parkinsonian	f	\N	\N	\N
3917	365	3912	5	Hemiplegic	f	\N	\N	\N
3918	365	3912	6	Unable to assess	f	\N	\N	\N
3919	366	\N	1	Pupillary light reflex	f	\N	\N	\N
3920	366	3919	1	Present bilateral	f	\N	\N	\N
3921	366	3919	2	Absent right	f	\N	\N	\N
3922	366	3919	3	Absent left	f	\N	\N	\N
3923	366	\N	2	Corneal reflex	f	\N	\N	\N
3924	366	3923	1	Present bilateral	f	\N	\N	\N
3925	366	3923	2	Absent right	f	\N	\N	\N
3926	366	3923	3	Absent left	f	\N	\N	\N
3927	366	\N	3	Oculocephalic reflex (doll's eyes)	f	\N	\N	\N
3928	366	3927	1	Present	f	\N	\N	\N
3929	366	3927	2	Absent	f	\N	\N	\N
3930	366	\N	4	Oculovestibular reflex (cold calorics)	f	\N	\N	\N
3931	366	3930	1	Present	f	\N	\N	\N
3932	366	3930	2	Absent	f	\N	\N	\N
3933	366	\N	5	Gag reflex	f	\N	\N	\N
3934	366	3933	1	Present	f	\N	\N	\N
3935	366	3933	2	Absent	f	\N	\N	\N
3936	366	\N	6	Cough reflex	f	\N	\N	\N
3937	366	3936	1	Present	f	\N	\N	\N
3938	366	3936	2	Absent	f	\N	\N	\N
3939	367	\N	1	Laboratory studies	f	\N	\N	\N
3940	367	3939	1	Repeat basic labs	f	\N	\N	\N
3941	367	3939	2	Specialized tests	t	Specialized tests	Enter specialized tests	\N
3942	367	3939	3	Frequency	t	Frequency	Enter frequency	\N
3943	367	\N	2	Imaging	f	\N	\N	\N
3944	367	3943	1	Repeat CT head	f	\N	\N	\N
3945	367	3943	2	MRI brain	f	\N	\N	\N
3946	367	3943	3	CT angiography	f	\N	\N	\N
3947	367	3943	4	Other	t	Other	Enter other	\N
3948	367	\N	3	Electroencephalogram (EEG)	f	\N	\N	\N
3949	367	3948	1	Routine	f	\N	\N	\N
3950	367	3948	2	Continuous monitoring	f	\N	\N	\N
3951	367	3948	3	Duration	t	Duration	Enter duration	\N
3952	367	\N	4	Consultation requests	f	\N	\N	\N
3953	367	3952	1	Neurology	f	\N	\N	\N
3954	367	3952	2	Neurosurgery	f	\N	\N	\N
3955	367	3952	3	Infectious disease	f	\N	\N	\N
3956	367	3952	4	Toxicology	f	\N	\N	\N
3957	367	3952	5	Psychiatry	f	\N	\N	\N
3958	367	3952	6	Other	t	Other	Enter other	\N
3959	367	\N	5	Other diagnostic studies	t	Other diagnostic studies	Enter other diagnostic studies	\N
3960	368	\N	1	Airway management	f	\N	\N	\N
3961	368	3960	1	Supplemental oxygen	f	\N	\N	\N
3962	368	3960	2	Intubation/mechanical ventilation	f	\N	\N	\N
3963	368	3960	3	Ventilator settings	t	Ventilator settings	Enter ventilator settings	\N
3964	368	3960	4	Extubation plan	t	Extubation plan	Enter extubation plan	\N
3965	368	\N	2	Hemodynamic management	f	\N	\N	\N
4168	381	\N	3	Muscle weakness	f	\N	\N	\N
3966	368	3965	1	IV fluid	t	IV fluid	Enter iv fluid	\N
3967	368	3965	2	Rate	t	Rate	Enter rate	\N
3968	368	3965	3	Blood pressure goals	t	Blood pressure goals	Enter blood pressure goals	\N
3969	368	3965	4	Vasoactive medications	t	Vasoactive medications	Enter vasoactive medications	\N
3970	368	\N	3	Neurological management	f	\N	\N	\N
3971	368	3970	1	Neuroprotective measures	f	\N	\N	\N
3972	368	3971	1	Head of bed elevation	f	\N	\N	\N
3973	368	3971	2	Avoiding fever	f	\N	\N	\N
3974	368	3971	3	Normoglycemia	f	\N	\N	\N
3975	368	3971	4	Normoxia	f	\N	\N	\N
3976	368	3971	5	Normocarbia	f	\N	\N	\N
3977	368	3970	2	Increased ICP management	f	\N	\N	\N
3978	368	3977	1	Hyperosmolar therapy	f	\N	\N	\N
3979	368	3978	1	Mannitol	f	\N	\N	\N
3980	368	3978	2	Hypertonic saline	f	\N	\N	\N
3981	368	3977	2	Hyperventilation	f	\N	\N	\N
3982	368	3977	3	Sedation	f	\N	\N	\N
3983	368	3977	4	CSF drainage	f	\N	\N	\N
3984	368	3970	3	Seizure management	f	\N	\N	\N
3985	368	3984	1	Antiepileptic medication	t	Antiepileptic medication	Enter antiepileptic medication	\N
3986	368	3984	2	Loading dose	t	Loading dose	Enter loading dose	\N
3987	368	3984	3	Maintenance dose	t	Maintenance dose	Enter maintenance dose	\N
3988	368	3984	4	Duration	t	Duration	Enter duration	\N
3989	368	\N	4	Specific treatment for primary diagnosis	f	\N	\N	\N
3990	368	3989	1	Thrombolysis/thrombectomy	f	\N	\N	\N
3991	368	3989	2	Antimicrobial therapy	f	\N	\N	\N
3992	368	3991	1	Agent(s)	t	Agent(s)	Enter agent(s)	\N
3993	368	3991	2	Duration	t	Duration	Enter duration	\N
3994	368	3989	3	Antidote administration	f	\N	\N	\N
3995	368	3994	1	Agent	t	Agent	Enter agent	\N
3996	368	3994	2	Dose	t	Dose	Enter dose	\N
3997	368	3989	4	Surgical intervention	f	\N	\N	\N
3998	368	3997	1	Type	t	Type	Enter type	\N
3999	368	3997	2	Timing	t	Timing	Enter timing	\N
4000	368	3989	5	Other specific treatment	t	Other specific treatment	Enter other specific treatment	\N
4001	368	\N	5	Management of complications	f	\N	\N	\N
4002	368	4001	1	Current complications	t	Current complications	Enter current complications	\N
4003	368	4001	2	Prevention strategies	t	Prevention strategies	Enter prevention strategies	\N
4004	368	\N	6	Medication management	f	\N	\N	\N
4005	368	4004	1	Continuation of home medications	t	Continuation of home medications	Enter continuation of home medications	\N
4006	368	4004	2	Modifications to home medications	t	Modifications to home medications	Enter modifications to home medications	\N
4007	368	4004	3	New medications	t	New medications	Enter new medications	\N
4008	368	4004	4	Medication discontinuation	t	Medication discontinuation	Enter medication discontinuation	\N
4009	368	\N	7	Supportive care	f	\N	\N	\N
4010	368	4009	1	Nutrition	f	\N	\N	\N
4011	368	4010	1	Diet	t	Diet	Enter diet	\N
4012	368	4010	2	Route	t	Route	Enter route	\N
4013	368	4010	3	NPO status	t	NPO status	Enter npo status	\N
4014	368	4009	2	VTE prophylaxis	f	\N	\N	\N
4015	368	4014	1	Mechanical	f	\N	\N	\N
4016	368	4014	2	Pharmacological	t	Pharmacological	Enter pharmacological	\N
4017	368	4009	3	Pressure injury prevention	f	\N	\N	\N
4018	368	4009	4	Glycemic control	f	\N	\N	\N
4019	368	4009	5	Other	t	Other	Enter other	\N
4020	369	\N	1	Neurological monitoring	f	\N	\N	\N
4021	369	4020	1	Neurological checks	f	\N	\N	\N
4022	369	4021	1	Frequency	t	Frequency	Enter frequency	\N
4023	369	4020	2	ICP monitoring	f	\N	\N	\N
4024	369	4020	3	Invasive monitoring	t	Invasive monitoring	Enter invasive monitoring	\N
4025	369	\N	2	Hemodynamic monitoring	f	\N	\N	\N
4026	369	4025	1	Telemetry	f	\N	\N	\N
4027	369	4025	2	Arterial line	f	\N	\N	\N
4028	369	4025	3	Central venous pressure	f	\N	\N	\N
4029	369	4025	4	Cardiac output monitoring	f	\N	\N	\N
4030	369	\N	3	Respiratory monitoring	f	\N	\N	\N
4031	369	4030	1	Pulse oximetry	f	\N	\N	\N
4032	369	4030	2	End-tidal CO2	f	\N	\N	\N
4033	369	4030	3	ABG frequency	t	ABG frequency	Enter abg frequency	\N
4034	369	\N	4	Laboratory monitoring	f	\N	\N	\N
4035	369	4034	1	Tests	t	Tests	Enter tests	\N
4036	369	4034	2	Frequency	t	Frequency	Enter frequency	\N
4037	369	\N	5	Medication level monitoring	f	\N	\N	\N
4038	369	4037	1	Medication	t	Medication	Enter medication	\N
4039	369	4037	2	Target level	t	Target level	Enter target level	\N
4040	369	4037	3	Frequency	t	Frequency	Enter frequency	\N
4041	369	\N	6	Clinical response monitoring	f	\N	\N	\N
4042	369	4041	1	Parameters	t	Parameters	Enter parameters	\N
4043	369	4041	2	Goals	t	Goals	Enter goals	\N
4044	369	4041	3	Timeframe	t	Timeframe	Enter timeframe	\N
4045	370	\N	1	Physical therapy	f	\N	\N	\N
4046	370	4045	1	Evaluation	f	\N	\N	\N
4047	370	4045	2	Treatment focus	t	Treatment focus	Enter treatment focus	\N
4048	370	4045	3	Frequency	t	Frequency	Enter frequency	\N
4049	370	\N	2	Occupational therapy	f	\N	\N	\N
4050	370	4049	1	Evaluation	f	\N	\N	\N
4051	370	4049	2	Treatment focus	t	Treatment focus	Enter treatment focus	\N
4052	370	4049	3	Frequency	t	Frequency	Enter frequency	\N
4053	370	\N	3	Speech therapy	f	\N	\N	\N
4054	370	4053	1	Evaluation	f	\N	\N	\N
4055	370	4053	2	Treatment focus	t	Treatment focus	Enter treatment focus	\N
4056	370	4053	3	Frequency	t	Frequency	Enter frequency	\N
4169	381	\N	4	Back pain	f	\N	\N	\N
4170	381	\N	5	Neck pain	f	\N	\N	\N
4057	370	\N	4	Other rehabilitation services	t	Other rehabilitation services	Enter other rehabilitation services	\N
4058	371	\N	1	Care coordination with:	f	\N	\N	\N
4059	371	4058	1	Primary care physician	f	\N	\N	\N
4060	371	4058	2	Neurologist	f	\N	\N	\N
4061	371	4058	3	Neurosurgeon	f	\N	\N	\N
4062	371	4058	4	Other specialists	t	Other specialists	Enter other specialists	\N
4063	371	4058	5	Family/caregivers	f	\N	\N	\N
4064	371	\N	2	Case management	f	\N	\N	\N
4065	371	\N	3	Social work referral	f	\N	\N	\N
4066	371	\N	4	Home health services	f	\N	\N	\N
4067	371	\N	5	Durable medical equipment needs	f	\N	\N	\N
4068	372	\N	1	Code status:	f	\N	\N	\N
4069	372	4068	1	Full code	f	\N	\N	\N
4070	372	4068	2	DNR	f	\N	\N	\N
4071	372	4068	3	DNI	f	\N	\N	\N
4072	372	4068	4	Comfort measures only	f	\N	\N	\N
4073	372	\N	2	Advanced directives reviewed	f	\N	\N	\N
4074	372	\N	3	Healthcare proxy identified	f	\N	\N	\N
4075	372	\N	4	Goals of care discussion	f	\N	\N	\N
4076	372	\N	5	Palliative care consult	f	\N	\N	\N
4077	373	\N	1	If improving	t	If improving	Enter if improving	\N
4078	373	\N	2	If not improving	t	If not improving	Enter if not improving	\N
4079	373	\N	3	If worsening	t	If worsening	Enter if worsening	\N
4080	373	\N	4	Critical thresholds for escalation of care	t	Critical thresholds for escalation of care	Enter critical thresholds for escalation of care	\N
4081	374	\N	1	Headache	f	\N	\N	\N
4082	374	\N	2	Vision changes	f	\N	\N	\N
4083	374	4082	1	Blurry vision	f	\N	\N	\N
4084	374	4082	2	Double vision (diplopia)	f	\N	\N	\N
4085	374	4082	3	Vision loss	f	\N	\N	\N
4086	374	4082	4	Visual hallucinations	f	\N	\N	\N
4087	374	\N	3	Hearing changes	f	\N	\N	\N
4088	374	4087	1	Hearing loss	f	\N	\N	\N
4089	374	4087	2	Tinnitus	f	\N	\N	\N
4090	374	4087	3	Auditory hallucinations	f	\N	\N	\N
4091	374	\N	4	Dizziness/Vertigo	f	\N	\N	\N
4092	374	\N	5	Balance problems	f	\N	\N	\N
4093	374	\N	6	Weakness	f	\N	\N	\N
4094	374	4093	1	Generalized	f	\N	\N	\N
4095	374	4093	2	Focal	t	Focal	Enter focal	\N
4096	374	\N	7	Numbness/Tingling	f	\N	\N	\N
4097	374	4096	1	Location	t	Location	Enter location	\N
4098	374	\N	8	Tremor	f	\N	\N	\N
4099	374	\N	9	Seizure activity	f	\N	\N	\N
4100	374	\N	10	Memory problems	f	\N	\N	\N
4101	374	\N	11	Disorientation	f	\N	\N	\N
4102	374	4101	1	Time	f	\N	\N	\N
4103	374	4101	2	Place	f	\N	\N	\N
4104	374	4101	3	Person	f	\N	\N	\N
4105	374	\N	12	Speech changes	f	\N	\N	\N
4106	374	4105	1	Slurred speech (dysarthria)	f	\N	\N	\N
4107	374	4105	2	Difficulty finding words (aphasia)	f	\N	\N	\N
4108	374	\N	13	Movement disorders	f	\N	\N	\N
4109	374	\N	14	Gait abnormalities	f	\N	\N	\N
4110	375	\N	1	Chest pain	f	\N	\N	\N
4111	375	\N	2	Palpitations	f	\N	\N	\N
4112	375	\N	3	Irregular heartbeat	f	\N	\N	\N
4113	375	\N	4	Orthostatic symptoms	f	\N	\N	\N
4114	375	\N	5	Syncope/Near-syncope	f	\N	\N	\N
4115	375	\N	6	Edema	f	\N	\N	\N
4116	375	4115	1	Location	t	Location	Enter location	\N
4117	375	\N	7	Known hypertension	f	\N	\N	\N
4118	375	\N	8	Known hypotension	f	\N	\N	\N
4119	376	\N	1	Shortness of breath	f	\N	\N	\N
4120	376	4119	1	At rest	f	\N	\N	\N
4121	376	4119	2	With exertion	f	\N	\N	\N
4122	376	\N	2	Cough	f	\N	\N	\N
4123	376	4122	1	Productive	f	\N	\N	\N
4124	376	4122	2	Non-productive	f	\N	\N	\N
4125	376	\N	3	Hemoptysis	f	\N	\N	\N
4126	376	\N	4	Wheezing	f	\N	\N	\N
4127	376	\N	5	Snoring/Sleep apnea	f	\N	\N	\N
4128	376	\N	6	Recent respiratory infection	f	\N	\N	\N
4129	377	\N	1	Nausea	f	\N	\N	\N
4130	377	\N	2	Vomiting	f	\N	\N	\N
4131	377	4130	1	Frequency	t	Frequency	Enter frequency	\N
4132	377	4130	2	Contents	t	Contents	Enter contents	\N
4133	377	\N	3	Diarrhea	f	\N	\N	\N
4134	377	4133	1	Duration	t	Duration	Enter duration	\N
4135	377	4133	2	Bloody	f	\N	\N	\N
4136	377	4133	3	Watery	f	\N	\N	\N
4137	377	\N	4	Constipation	f	\N	\N	\N
4138	377	\N	5	Abdominal pain	f	\N	\N	\N
4139	377	\N	6	Change in bowel habits	f	\N	\N	\N
4140	377	\N	7	Melena	f	\N	\N	\N
4141	377	\N	8	Hematochezia	f	\N	\N	\N
4142	377	\N	9	Jaundice	f	\N	\N	\N
4143	377	\N	10	Abdominal distension	f	\N	\N	\N
4144	378	\N	1	Urinary frequency	f	\N	\N	\N
4145	378	\N	2	Urinary urgency	f	\N	\N	\N
4146	378	\N	3	Dysuria	f	\N	\N	\N
4147	378	\N	4	Hematuria	f	\N	\N	\N
4148	378	\N	5	Urinary retention	f	\N	\N	\N
4149	378	\N	6	Urinary incontinence	f	\N	\N	\N
4150	378	\N	7	Changes in urinary output	f	\N	\N	\N
4151	378	4150	1	Decreased	f	\N	\N	\N
4152	378	4150	2	Increased	f	\N	\N	\N
4153	378	\N	8	Flank pain	f	\N	\N	\N
4154	379	\N	1	Polydipsia	f	\N	\N	\N
4155	379	\N	2	Polyphagia	f	\N	\N	\N
4156	379	\N	3	Polyuria	f	\N	\N	\N
4157	379	\N	4	Heat/Cold intolerance	f	\N	\N	\N
4158	379	\N	5	Hair changes	f	\N	\N	\N
4159	379	\N	6	Skin changes	f	\N	\N	\N
4160	379	\N	7	Unexplained weight changes	f	\N	\N	\N
4161	380	\N	1	Easy bruising	f	\N	\N	\N
4162	380	\N	2	Bleeding tendency	f	\N	\N	\N
4163	380	\N	3	Lymphadenopathy	f	\N	\N	\N
4164	380	\N	4	Known anemia	f	\N	\N	\N
4165	380	\N	5	Known coagulopathy	f	\N	\N	\N
4166	381	\N	1	Joint pain	f	\N	\N	\N
4167	381	\N	2	Muscle pain	f	\N	\N	\N
4171	381	\N	6	Stiffness	f	\N	\N	\N
4172	381	\N	7	Swelling	f	\N	\N	\N
4173	382	\N	1	Rash	f	\N	\N	\N
4174	382	4173	1	Location	t	Location	Enter location	\N
4175	382	4173	2	Description	t	Description	Enter description	\N
4176	382	\N	2	Pruritus	f	\N	\N	\N
4177	382	\N	3	Color changes	f	\N	\N	\N
4178	382	\N	4	Diaphoresis	f	\N	\N	\N
4179	382	\N	5	Dryness	f	\N	\N	\N
4180	382	\N	6	Temperature changes	f	\N	\N	\N
4181	383	\N	1	Mood changes	f	\N	\N	\N
4182	383	\N	2	Anxiety	f	\N	\N	\N
4183	383	\N	3	Depression	f	\N	\N	\N
4184	383	\N	4	Hallucinations	f	\N	\N	\N
4185	383	\N	5	Delusions	f	\N	\N	\N
4186	383	\N	6	Paranoia	f	\N	\N	\N
4187	383	\N	7	Suicidal ideation	f	\N	\N	\N
4188	383	\N	8	Homicidal ideation	f	\N	\N	\N
4189	383	\N	9	Sleep disturbances	f	\N	\N	\N
4190	384	\N	1	Fever	f	\N	\N	\N
4191	384	\N	2	Chills	f	\N	\N	\N
4192	384	\N	3	Fatigue	f	\N	\N	\N
4193	384	\N	4	Malaise	f	\N	\N	\N
4194	384	\N	5	Night sweats	f	\N	\N	\N
4195	384	\N	6	Appetite changes	f	\N	\N	\N
4196	384	\N	7	Weight changes	f	\N	\N	\N
4197	385	\N	1	Previous stroke/TIA (I63.9, G45.9)	f	\N	\N	\N
4198	385	\N	2	Seizure disorder/Epilepsy (G40.909)	f	\N	\N	\N
4199	385	\N	3	Brain tumor (D43.2)	f	\N	\N	\N
4200	385	\N	4	Prior traumatic brain injury (S06.9XXA)	f	\N	\N	\N
4201	385	\N	5	Neurodegenerative disease	f	\N	\N	\N
4202	385	4201	1	Alzheimer's disease (G30.9)	f	\N	\N	\N
4203	385	4201	2	Parkinson's disease (G20)	f	\N	\N	\N
4204	385	4201	3	Multiple sclerosis (G35)	f	\N	\N	\N
4205	385	4201	4	Other	t	Other	Enter other	\N
4206	385	\N	6	Prior CNS infection	f	\N	\N	\N
4207	385	\N	7	Migraine with aura (G43.109)	f	\N	\N	\N
4208	385	\N	8	History of CNS surgery	f	\N	\N	\N
4209	386	\N	1	Hypertension (I10)	f	\N	\N	\N
4210	386	\N	2	Atrial fibrillation (I48.91)	f	\N	\N	\N
4211	386	\N	3	Coronary artery disease (I25.10)	f	\N	\N	\N
4212	386	\N	4	Heart failure (I50.9)	f	\N	\N	\N
4213	386	\N	5	Valvular heart disease (I38)	f	\N	\N	\N
4214	386	\N	6	Cardiomyopathy (I42.9)	f	\N	\N	\N
4215	386	\N	7	Carotid artery stenosis (I65.29)	f	\N	\N	\N
4216	386	\N	8	Vertebrobasilar insufficiency (G45.0)	f	\N	\N	\N
4217	386	\N	9	Venous thromboembolism (I82.90)	f	\N	\N	\N
4218	386	\N	10	Endocarditis (I33.9)	f	\N	\N	\N
4219	386	\N	11	Cardiac arrhythmias (I49.9)	f	\N	\N	\N
4220	386	\N	12	Patent foramen ovale (Q21.1)	f	\N	\N	\N
4221	386	\N	13	Recent cardiac procedure	f	\N	\N	\N
4222	387	\N	1	Diabetes mellitus (E11.9)	f	\N	\N	\N
4223	387	\N	2	Chronic kidney disease (N18.9)	f	\N	\N	\N
4224	387	\N	3	Liver disease (K76.9)	f	\N	\N	\N
4225	387	4224	1	Cirrhosis (K74.60)	f	\N	\N	\N
4226	387	4224	2	Hepatitis (K75.9)	f	\N	\N	\N
4227	387	\N	4	Adrenal insufficiency (E27.40)	f	\N	\N	\N
4228	387	\N	5	Thyroid disease	f	\N	\N	\N
4229	387	4228	1	Hypothyroidism (E03.9)	f	\N	\N	\N
4230	387	4228	2	Hyperthyroidism (E05.90)	f	\N	\N	\N
4231	387	\N	6	Electrolyte disorders	f	\N	\N	\N
4232	387	4231	1	Hyponatremia (E87.1)	f	\N	\N	\N
4233	387	4231	2	Hypernatremia (E87.0)	f	\N	\N	\N
4234	387	4231	3	Hypocalcemia (E83.51)	f	\N	\N	\N
4235	387	4231	4	Hypercalcemia (E83.52)	f	\N	\N	\N
4236	387	\N	7	Nutritional deficiencies	f	\N	\N	\N
4237	387	4236	1	Vitamin B12 deficiency (E53.8)	f	\N	\N	\N
4238	387	4236	2	Thiamine deficiency (E51.9)	f	\N	\N	\N
4239	387	4236	3	Folate deficiency (E53.8)	f	\N	\N	\N
4240	387	\N	8	Recent bariatric surgery (Z98.84)	f	\N	\N	\N
4241	388	\N	1	Alcohol use disorder (F10.20)	f	\N	\N	\N
4242	388	\N	2	Opioid use disorder (F11.20)	f	\N	\N	\N
4243	388	\N	3	Stimulant use disorder (F14.20, F15.20)	f	\N	\N	\N
4244	388	\N	4	Sedative use disorder (F13.20)	f	\N	\N	\N
4245	388	\N	5	Other substance use disorder	t	Other substance use disorder	Enter other substance use disorder	\N
4246	388	\N	6	Recent substance intoxication	f	\N	\N	\N
4247	388	\N	7	Risk for substance withdrawal	f	\N	\N	\N
4248	388	\N	8	Polypharmacy (≥5 medications)	f	\N	\N	\N
4249	388	\N	9	History of medication non-adherence	f	\N	\N	\N
4250	389	\N	1	Immunocompromised state	f	\N	\N	\N
4251	389	4250	1	HIV/AIDS (B20)	f	\N	\N	\N
4252	389	4250	2	Organ transplant recipient (Z94.9)	f	\N	\N	\N
4253	389	4250	3	Current chemotherapy (Z51.11)	f	\N	\N	\N
4254	389	4250	4	Immunosuppressive medication use	f	\N	\N	\N
4255	389	4250	5	Congenital immunodeficiency (D84.9)	f	\N	\N	\N
4256	389	\N	2	Recent infection	f	\N	\N	\N
4257	389	4256	1	Upper respiratory infection	f	\N	\N	\N
4258	389	4256	2	Urinary tract infection (N39.0)	f	\N	\N	\N
4259	389	4256	3	Skin/soft tissue infection (L08.9)	f	\N	\N	\N
4260	389	4256	4	Other	t	Other	Enter other	\N
4261	389	\N	3	Endemic infectious disease exposure	f	\N	\N	\N
4262	389	\N	4	Travel to regions with endemic infections	f	\N	\N	\N
4263	389	\N	5	Close contact with infected individuals	f	\N	\N	\N
4264	390	\N	1	Recent high altitude exposure	f	\N	\N	\N
4265	390	\N	2	Extreme temperature exposure	f	\N	\N	\N
4266	390	4265	1	Heat exposure (T67.9)	f	\N	\N	\N
4267	390	4265	2	Cold exposure (T68)	f	\N	\N	\N
4268	390	\N	3	Carbon monoxide exposure (T58.94XA)	f	\N	\N	\N
4269	390	\N	4	Other toxic exposure	t	Other toxic exposure	Enter other toxic exposure	\N
4270	390	\N	5	Occupational hazards	t	Occupational hazards	Enter occupational hazards	\N
4271	391	\N	1	Recent head trauma (S00.93XA)	f	\N	\N	\N
4272	391	\N	2	Recent fall (W19.XXXA)	f	\N	\N	\N
4273	391	\N	3	Motor vehicle accident (V89.9XXA)	f	\N	\N	\N
4274	391	\N	4	Physical assault (Y09)	f	\N	\N	\N
4275	391	\N	5	Sports injury	f	\N	\N	\N
4276	392	\N	1	Major depressive disorder (F32.9)	f	\N	\N	\N
4277	392	\N	2	Bipolar disorder (F31.9)	f	\N	\N	\N
4278	392	\N	3	Schizophrenia spectrum disorders (F20.9)	f	\N	\N	\N
4279	392	\N	4	Anxiety disorders (F41.9)	f	\N	\N	\N
4280	392	\N	5	Post-traumatic stress disorder (F43.10)	f	\N	\N	\N
4281	392	\N	6	Previous suicide attempts (T14.91)	f	\N	\N	\N
4282	392	\N	7	Recent psychiatric medication changes	f	\N	\N	\N
4283	393	\N	1	Family history of stroke	f	\N	\N	\N
4284	393	\N	2	Family history of seizure disorder	f	\N	\N	\N
4285	393	\N	3	Family history of neurodegenerative disease	f	\N	\N	\N
4286	393	\N	4	Known genetic disorder	t	Known genetic disorder	Enter known genetic disorder	\N
4287	393	\N	5	Family history of metabolic disorder	f	\N	\N	\N
4288	394	\N	1	Ordered	f	\N	\N	\N
4289	394	\N	2	Completed	f	\N	\N	\N
4290	394	\N	3	Type:	f	\N	\N	\N
4291	394	4290	1	Routine EEG	f	\N	\N	\N
4292	394	4290	2	Emergent EEG	f	\N	\N	\N
4293	394	4290	3	Continuous EEG monitoring	f	\N	\N	\N
4294	394	4290	4	Video EEG	f	\N	\N	\N
4295	394	\N	4	Findings:	f	\N	\N	\N
4296	394	4295	1	Normal	f	\N	\N	\N
4297	394	4295	2	Seizure activity	f	\N	\N	\N
4298	394	4297	1	Focal	f	\N	\N	\N
4299	394	4297	2	Generalized	f	\N	\N	\N
4300	394	4297	3	Status epilepticus	f	\N	\N	\N
4301	394	4295	3	Non-convulsive status epilepticus	f	\N	\N	\N
4302	394	4295	4	Post-ictal state	f	\N	\N	\N
4303	394	4295	5	Focal slowing	f	\N	\N	\N
4304	394	4303	1	Location	t	Location	Enter location	\N
4305	394	4295	6	Diffuse slowing	f	\N	\N	\N
4306	394	4295	7	Periodic discharges	f	\N	\N	\N
4307	394	4306	1	Generalized (GPDs)	f	\N	\N	\N
4308	394	4306	2	Lateralized (LPDs)	f	\N	\N	\N
4309	394	4306	3	Bilateral independent (BIPDs)	f	\N	\N	\N
4310	394	4295	8	Triphasic waves	f	\N	\N	\N
4311	394	4295	9	Burst suppression	f	\N	\N	\N
4312	394	4295	10	Electrocerebral silence	f	\N	\N	\N
4313	394	4295	11	Other	t	Other	Enter other	\N
4314	395	\N	1	Ordered	f	\N	\N	\N
4315	395	\N	2	Completed	f	\N	\N	\N
4316	395	\N	3	Opening pressure	t	Opening pressure	Enter opening pressure	\N
4317	395	4316	1	Elevated (>20 cmH2O)	f	\N	\N	\N
4318	395	4316	2	Normal (10-20 cmH2O)	f	\N	\N	\N
4319	395	4316	3	Low (<10 cmH2O)	f	\N	\N	\N
4320	395	\N	4	Appearance:	f	\N	\N	\N
4321	395	4320	1	Clear	f	\N	\N	\N
4322	395	4320	2	Cloudy	f	\N	\N	\N
4323	395	4320	3	Xanthochromic	f	\N	\N	\N
4324	395	4320	4	Bloody	f	\N	\N	\N
4325	395	\N	5	Cell count:	f	\N	\N	\N
4326	395	4325	1	WBC	t	WBC	Enter wbc	\N
4327	395	4326	1	Neutrophils	t	Neutrophils	Enter neutrophils	\N
4328	395	4326	2	Lymphocytes	t	Lymphocytes	Enter lymphocytes	\N
4329	395	4326	3	Monocytes	t	Monocytes	Enter monocytes	\N
4330	395	4325	2	RBC	t	RBC	Enter rbc	\N
4331	395	\N	6	Glucose	t	Glucose	Enter glucose	\N
4332	395	4331	1	Low (<40 mg/dL or <2/3 serum)	f	\N	\N	\N
4333	395	4331	2	Normal	f	\N	\N	\N
4334	395	\N	7	Protein	t	Protein	Enter protein	\N
4335	395	4334	1	Elevated (>45 mg/dL)	f	\N	\N	\N
4336	395	4334	2	Normal	f	\N	\N	\N
4337	395	\N	8	Gram stain:	f	\N	\N	\N
4338	395	4337	1	Positive (specify)	t	Positive (specify)	Enter positive (specify)	\N
4339	395	4337	2	Negative	f	\N	\N	\N
4340	395	\N	9	Culture:	f	\N	\N	\N
4341	395	4340	1	Positive (specify)	t	Positive (specify)	Enter positive (specify)	\N
4342	395	4340	2	Negative	f	\N	\N	\N
4343	395	4340	3	Pending	f	\N	\N	\N
4344	395	\N	10	Special studies:	f	\N	\N	\N
4345	395	4344	1	HSV PCR	f	\N	\N	\N
4346	395	4344	2	VZV PCR	f	\N	\N	\N
4347	395	4344	3	Enterovirus PCR	f	\N	\N	\N
4348	395	4344	4	Cryptococcal antigen	f	\N	\N	\N
4349	395	4344	5	AFB smear/culture	f	\N	\N	\N
4350	395	4344	6	Fungal smear/culture	f	\N	\N	\N
4351	395	4344	7	Cytology	f	\N	\N	\N
4352	395	4344	8	Oligoclonal bands	f	\N	\N	\N
4353	395	4344	9	IgG index	f	\N	\N	\N
4354	395	4344	10	Other	t	Other	Enter other	\N
4355	396	\N	1	Mini-Mental State Examination (MMSE)	f	\N	\N	\N
4356	396	4355	1	Score	t	Score	Enter score	\N
4357	396	\N	2	Montreal Cognitive Assessment (MoCA)	f	\N	\N	\N
4358	396	4357	1	Score	t	Score	Enter score	\N
4359	396	\N	3	Confusion Assessment Method (CAM)	f	\N	\N	\N
4360	396	4359	1	Positive for delirium	f	\N	\N	\N
4361	396	4359	2	Negative for delirium	f	\N	\N	\N
4362	396	\N	4	Richmond Agitation-Sedation Scale (RASS)	f	\N	\N	\N
4363	396	4362	1	Score	t	Score	Enter score	\N
4364	396	\N	5	Other cognitive screening	t	Other cognitive screening	Enter other cognitive screening	\N
4365	397	\N	1	Somatosensory evoked potentials (SSEP)	f	\N	\N	\N
4366	397	4365	1	Normal	f	\N	\N	\N
4367	397	4365	2	Abnormal	f	\N	\N	\N
4368	397	4365	3	Findings	t	Findings	Enter findings	\N
4369	397	\N	2	Visual evoked potentials (VEP)	f	\N	\N	\N
4370	397	4369	1	Normal	f	\N	\N	\N
4371	397	4369	2	Abnormal	f	\N	\N	\N
4372	397	4369	3	Findings	t	Findings	Enter findings	\N
4373	397	\N	3	Brainstem auditory evoked potentials (BAEP)	f	\N	\N	\N
4374	397	4373	1	Normal	f	\N	\N	\N
4375	397	4373	2	Abnormal	f	\N	\N	\N
4376	397	4373	3	Findings	t	Findings	Enter findings	\N
4377	398	\N	1	Visual acuity	f	\N	\N	\N
4378	398	\N	2	Visual fields	f	\N	\N	\N
4379	398	\N	3	Fundoscopic exam	f	\N	\N	\N
4380	398	4379	1	Papilledema	f	\N	\N	\N
4381	398	4379	2	Retinal hemorrhages	f	\N	\N	\N
4382	398	4379	3	Other	t	Other	Enter other	\N
4383	398	\N	4	Ocular coherence tomography (OCT)	f	\N	\N	\N
4384	398	\N	5	Other	t	Other	Enter other	\N
4385	399	\N	1	Polysomnography	f	\N	\N	\N
4386	399	4385	1	Normal	f	\N	\N	\N
4387	399	4385	2	Obstructive sleep apnea	f	\N	\N	\N
4388	399	4385	3	Central sleep apnea	f	\N	\N	\N
4389	399	4385	4	Other	t	Other	Enter other	\N
4390	399	\N	2	Multiple sleep latency test (MSLT)	f	\N	\N	\N
4391	399	4390	1	Normal	f	\N	\N	\N
4392	399	4390	2	Narcolepsy	f	\N	\N	\N
4393	399	4390	3	Other	t	Other	Enter other	\N
4394	400	\N	1	Tilt table test	f	\N	\N	\N
4395	400	4394	1	Normal	f	\N	\N	\N
4396	400	4394	2	Orthostatic hypotension	f	\N	\N	\N
4397	400	4394	3	Neurally mediated syncope	f	\N	\N	\N
4398	400	4394	4	POTS	f	\N	\N	\N
4399	400	4394	5	Other	t	Other	Enter other	\N
4400	400	\N	2	Other autonomic tests	t	Other autonomic tests	Enter other autonomic tests	\N
4401	401	\N	1	Type of test	t	Type of test	Enter type of test	\N
4402	401	\N	2	Findings	t	Findings	Enter findings	\N
4403	402	\N	1	Type of testing	t	Type of testing	Enter type of testing	\N
4404	402	\N	2	Findings	t	Findings	Enter findings	\N
4405	403	\N	1	Tissue biopsy:	f	\N	\N	\N
4406	403	4405	1	Brain	f	\N	\N	\N
4407	403	4405	2	Nerve	f	\N	\N	\N
4408	403	4405	3	Muscle	f	\N	\N	\N
4409	403	4405	4	Other	t	Other	Enter other	\N
4410	403	4405	5	Findings	t	Findings	Enter findings	\N
4411	403	\N	2	Cerebral angiography	f	\N	\N	\N
4412	403	4411	1	Findings	t	Findings	Enter findings	\N
4413	403	\N	3	Electromyography (EMG)/Nerve conduction studies (NCS)	f	\N	\N	\N
4414	403	4413	1	Findings	t	Findings	Enter findings	\N
4415	403	\N	4	Other test	t	Other test	Enter other test	\N
4416	403	4415	1	Findings	t	Findings	Enter findings	\N
4417	404	\N	1	Normal diet	f	\N	\N	\N
4418	404	\N	2	Poor oral intake (R63.0)	f	\N	\N	\N
4419	404	\N	3	Unable to take oral intake (R63.0)	f	\N	\N	\N
4420	404	\N	4	NPO for medical reasons	f	\N	\N	\N
4421	404	\N	5	Tube feeding	f	\N	\N	\N
4422	404	\N	6	Parenteral nutrition	f	\N	\N	\N
4423	404	\N	7	Special diet	t	Special diet	Enter special diet	\N
4424	405	\N	1	Recent weight loss (R63.4)	f	\N	\N	\N
4425	405	\N	2	Recent weight gain (R63.5)	f	\N	\N	\N
4426	405	\N	3	Decreased appetite (R63.0)	f	\N	\N	\N
4427	405	\N	4	Increased appetite (R63.1)	f	\N	\N	\N
4428	405	\N	5	Change in diet pattern	f	\N	\N	\N
4429	406	\N	1	Well hydrated	f	\N	\N	\N
4430	406	\N	2	Mild dehydration	f	\N	\N	\N
4431	406	\N	3	Moderate dehydration (E86.0)	f	\N	\N	\N
4432	406	\N	4	Severe dehydration (E86.0)	f	\N	\N	\N
4433	406	\N	5	Unable to maintain hydration orally	f	\N	\N	\N
4434	407	\N	1	Nausea (R11.0)	f	\N	\N	\N
4435	407	\N	2	Vomiting (R11.10)	f	\N	\N	\N
4436	407	\N	3	Diarrhea (R19.7)	f	\N	\N	\N
4437	407	\N	4	Constipation (K59.00)	f	\N	\N	\N
4438	407	\N	5	Abdominal pain (R10.9)	f	\N	\N	\N
4439	407	\N	6	Dysphagia (R13.10)	f	\N	\N	\N
4440	407	\N	7	Odynophagia (R13.10)	f	\N	\N	\N
4441	408	\N	1	Recent food poisoning suspect	f	\N	\N	\N
4442	408	\N	2	Food allergies	t	Food allergies	Enter food allergies	\N
4443	408	\N	3	Recent unusual foods	f	\N	\N	\N
4444	408	\N	4	Raw or undercooked foods	f	\N	\N	\N
4445	408	\N	5	International foods	f	\N	\N	\N
4446	408	\N	6	Shared meals with ill individuals	f	\N	\N	\N
4447	409	\N	1	Malnutrition risk (E46)	f	\N	\N	\N
4448	409	\N	2	Vitamin deficiencies	f	\N	\N	\N
4449	409	\N	3	Electrolyte imbalances	f	\N	\N	\N
4450	409	\N	4	Special nutritional needs	f	\N	\N	\N
4451	410	\N	1	Acute onset (< 3 days)	f	\N	\N	\N
4452	410	\N	2	Subacute onset (3-14 days)	f	\N	\N	\N
4453	410	\N	3	Chronic onset (> 14 days)	f	\N	\N	\N
4454	410	\N	4	Recurrent pattern	f	\N	\N	\N
4455	410	\N	5	Circadian pattern (morning lows, afternoon highs)	f	\N	\N	\N
4456	411	\N	1	Measured temperature	t	Measured temperature	Enter measured temperature	\N
4457	411	\N	2	Method of measurement:	f	\N	\N	\N
4458	411	4457	1	Oral	f	\N	\N	\N
4459	411	4457	2	Rectal	f	\N	\N	\N
4460	411	4457	3	Axillary	f	\N	\N	\N
4461	411	4457	4	Temporal	f	\N	\N	\N
4462	411	4457	5	Tympanic	f	\N	\N	\N
4463	411	\N	3	Temperature pattern:	f	\N	\N	\N
4464	411	4463	1	Sustained (persistent elevation)	f	\N	\N	\N
4465	411	4463	2	Intermittent (returns to normal between spikes)	f	\N	\N	\N
4466	411	4463	3	Remittent (fluctuates but remains above normal)	f	\N	\N	\N
4467	411	4463	4	Relapsing (fever-free periods of days between episodes)	f	\N	\N	\N
4468	412	\N	1	Chills	f	\N	\N	\N
4469	412	\N	2	Rigors	f	\N	\N	\N
4470	412	\N	3	Diaphoresis/sweating	f	\N	\N	\N
4471	412	\N	4	Night sweats	f	\N	\N	\N
4472	412	\N	5	Fatigue	f	\N	\N	\N
4473	412	\N	6	Anorexia	f	\N	\N	\N
4474	412	\N	7	Weight loss	f	\N	\N	\N
4475	412	\N	8	Malaise	f	\N	\N	\N
4476	413	\N	1	Recent travel history	t	Recent travel history	Enter recent travel history	\N
4477	413	\N	2	Animal exposure	f	\N	\N	\N
4478	413	\N	3	Tick exposure	f	\N	\N	\N
4479	413	\N	4	Mosquito exposure	f	\N	\N	\N
4480	413	\N	5	Occupational exposures	f	\N	\N	\N
4481	413	\N	6	Sick contacts	f	\N	\N	\N
4482	413	\N	7	Congregate living situation	f	\N	\N	\N
4483	413	\N	8	Recent hospitalization (past 90 days)	f	\N	\N	\N
4484	414	\N	1	Response to antipyretics	t	Response to antipyretics	Enter response to antipyretics	\N
4485	414	\N	2	Recent antipyretic use (may mask fever)	f	\N	\N	\N
4486	414	4485	1	Acetaminophen	f	\N	\N	\N
4487	414	4485	2	NSAIDs	f	\N	\N	\N
4488	414	4485	3	Aspirin	f	\N	\N	\N
4489	414	\N	3	Behavioral changes during febrile episode	f	\N	\N	\N
4490	415	\N	1	Baseline temperature trend	t	Baseline temperature trend	Enter baseline temperature trend	\N
4491	415	\N	2	Recent changes in functional status	f	\N	\N	\N
4492	415	\N	3	Recent changes in cognitive status	f	\N	\N	\N
4493	416	\N	1	Antibiotics	t	Antibiotics	Enter antibiotics	\N
4494	416	4493	1	Start date	t	Start date	Enter start date	\N
4495	416	4493	2	Dosage	t	Dosage	Enter dosage	\N
4496	416	\N	2	Antivirals	t	Antivirals	Enter antivirals	\N
4497	416	4496	1	Start date	t	Start date	Enter start date	\N
4498	416	4496	2	Dosage	t	Dosage	Enter dosage	\N
4499	416	\N	3	Antifungals	t	Antifungals	Enter antifungals	\N
4500	416	4499	1	Start date	t	Start date	Enter start date	\N
4501	416	4499	2	Dosage	t	Dosage	Enter dosage	\N
4502	417	\N	1	Acetaminophen	f	\N	\N	\N
4503	417	4502	1	Dosage	t	Dosage	Enter dosage	\N
4504	417	4502	2	Last dose	t	Last dose	Enter last dose	\N
4505	417	\N	2	NSAIDs	f	\N	\N	\N
4506	417	4505	1	Specific NSAID	t	Specific NSAID	Enter specific nsaid	\N
4507	417	4505	2	Dosage	t	Dosage	Enter dosage	\N
4508	417	4505	3	Last dose	t	Last dose	Enter last dose	\N
4509	417	\N	3	Aspirin	f	\N	\N	\N
4510	417	4509	1	Dosage	t	Dosage	Enter dosage	\N
4511	417	4509	2	Last dose	t	Last dose	Enter last dose	\N
4512	418	\N	1	Corticosteroids	f	\N	\N	\N
4513	418	\N	2	Biologic agents	f	\N	\N	\N
4514	418	\N	3	Chemotherapy	f	\N	\N	\N
4515	418	\N	4	Transplant anti-rejection medications	f	\N	\N	\N
4516	418	\N	5	Disease-modifying anti-rheumatic drugs (DMARDs)	f	\N	\N	\N
4517	419	\N	1	Cardiovascular medications	f	\N	\N	\N
4518	419	\N	2	Pulmonary medications	f	\N	\N	\N
4519	419	\N	3	Endocrine medications	f	\N	\N	\N
4520	419	\N	4	Neurologic medications	f	\N	\N	\N
4521	419	\N	5	Psychiatric medications	f	\N	\N	\N
4522	419	\N	6	Gastrointestinal medications	f	\N	\N	\N
4523	419	\N	7	Anticoagulants/antiplatelets	f	\N	\N	\N
4524	419	\N	8	Vitamins and supplements	f	\N	\N	\N
4525	420	\N	1	Recent medication changes	f	\N	\N	\N
4526	420	\N	2	Medication compliance issues	f	\N	\N	\N
4527	420	\N	3	Therapeutic effects observed	f	\N	\N	\N
4528	420	\N	4	Side effects reported	f	\N	\N	\N
4529	421	\N	1	Antibiotic allergies	t	Antibiotic allergies	Enter antibiotic allergies	\N
4530	421	4529	1	Reaction type	t	Reaction type	Enter reaction type	\N
4531	421	\N	2	Other medication allergies	t	Other medication allergies	Enter other medication allergies	\N
4532	421	4531	1	Reaction type	t	Reaction type	Enter reaction type	\N
4533	422	\N	1	Poor appetite	f	\N	\N	\N
4534	422	\N	2	Decreased oral intake	f	\N	\N	\N
4535	422	\N	3	Weight loss	f	\N	\N	\N
4536	422	\N	4	Weight gain	f	\N	\N	\N
4537	422	\N	5	Special diet	f	\N	\N	\N
4538	422	\N	6	Nutritional supplements	f	\N	\N	\N
4539	422	\N	7	Enteral feeding	f	\N	\N	\N
4540	422	\N	8	Parenteral nutrition	f	\N	\N	\N
4541	423	\N	1	Adequate oral fluid intake	f	\N	\N	\N
4542	423	\N	2	Reduced oral fluid intake	f	\N	\N	\N
4543	423	\N	3	Signs of dehydration	f	\N	\N	\N
4544	423	\N	4	IV fluid requirement	f	\N	\N	\N
4545	424	\N	1	Normal swallowing	f	\N	\N	\N
4546	424	\N	2	Dysphagia for solids	f	\N	\N	\N
4547	424	\N	3	Dysphagia for liquids	f	\N	\N	\N
4548	424	\N	4	Aspiration risk	f	\N	\N	\N
4549	424	\N	5	Requires modified consistency	f	\N	\N	\N
4550	424	\N	6	Requires feeding assistance	f	\N	\N	\N
4551	425	\N	1	Inadequate protein intake	f	\N	\N	\N
4552	425	\N	2	Inadequate caloric intake	f	\N	\N	\N
4553	425	\N	3	Vitamin deficiencies	f	\N	\N	\N
4554	425	4553	1	B12 deficiency (potentially related to neuropathy)	f	\N	\N	\N
4555	425	4553	2	Vitamin D deficiency (potentially related to myopathy)	f	\N	\N	\N
4556	425	4553	3	Thiamine deficiency	f	\N	\N	\N
4557	425	\N	4	Electrolyte imbalances	f	\N	\N	\N
4558	425	4557	1	Potassium	f	\N	\N	\N
4559	425	4557	2	Calcium	f	\N	\N	\N
4560	425	4557	3	Magnesium	f	\N	\N	\N
4561	425	4557	4	Phosphate	f	\N	\N	\N
4562	425	\N	5	Alcohol use affecting nutrition	f	\N	\N	\N
4563	425	\N	6	Malabsorption issues	f	\N	\N	\N
4564	426	\N	1	Diabetes affecting meal patterns	f	\N	\N	\N
4565	426	\N	2	Hypoglycemic episodes	f	\N	\N	\N
4566	426	\N	3	Renal dietary restrictions	f	\N	\N	\N
4567	426	\N	4	Hepatic dietary restrictions	f	\N	\N	\N
4568	426	\N	5	Food allergies/intolerances	f	\N	\N	\N
4569	427	\N	1	Acute onset (within 24 hours)	f	\N	\N	\N
4570	427	\N	2	Subacute onset (days to weeks)	f	\N	\N	\N
4571	427	\N	3	Gradual onset (weeks to months)	f	\N	\N	\N
4572	427	\N	4	Progressive worsening	f	\N	\N	\N
4573	427	\N	5	Stable symptoms	f	\N	\N	\N
4574	427	\N	6	Fluctuating symptoms	f	\N	\N	\N
4575	427	\N	7	Episodic symptoms	f	\N	\N	\N
4576	428	\N	1	Generalized weakness	f	\N	\N	\N
4577	428	\N	2	Focal weakness	f	\N	\N	\N
4578	428	\N	3	Unilateral weakness	f	\N	\N	\N
4579	428	\N	4	Bilateral weakness	f	\N	\N	\N
4580	428	\N	5	Proximal muscle weakness	f	\N	\N	\N
4581	428	\N	6	Distal muscle weakness	f	\N	\N	\N
4582	428	\N	7	Facial weakness	f	\N	\N	\N
4583	428	\N	8	Neck muscle weakness	f	\N	\N	\N
4584	428	\N	9	Upper extremity involvement	f	\N	\N	\N
4585	428	\N	10	Lower extremity involvement	f	\N	\N	\N
4586	428	\N	11	Worse with exertion	f	\N	\N	\N
4587	428	\N	12	Worse later in day	f	\N	\N	\N
4588	428	\N	13	Worse after specific activities	f	\N	\N	\N
4589	428	\N	14	Improves with rest	f	\N	\N	\N
4590	429	\N	1	Fatigue	f	\N	\N	\N
4591	429	\N	2	Lethargy	f	\N	\N	\N
4592	429	\N	3	General malaise	f	\N	\N	\N
4593	429	\N	4	Muscle pain/tenderness	f	\N	\N	\N
4594	429	\N	5	Muscle cramps	f	\N	\N	\N
4595	429	\N	6	Fasciculations	f	\N	\N	\N
4596	429	\N	7	Sensory changes/numbness	f	\N	\N	\N
4597	429	\N	8	Paresthesias	f	\N	\N	\N
4598	429	\N	9	Gait instability	f	\N	\N	\N
4599	429	\N	10	Coordination problems	f	\N	\N	\N
4600	429	\N	11	Speech changes	f	\N	\N	\N
4601	429	\N	12	Visual changes	f	\N	\N	\N
4602	429	\N	13	Swallowing difficulties	f	\N	\N	\N
4603	429	\N	14	Breathing difficulties	f	\N	\N	\N
4604	429	\N	15	Headache	f	\N	\N	\N
4605	429	\N	16	Fever	f	\N	\N	\N
4606	429	\N	17	Weight loss	f	\N	\N	\N
4607	429	\N	18	Mental status changes	f	\N	\N	\N
4608	430	\N	1	No prior episodes	f	\N	\N	\N
4609	430	\N	2	Previous similar episodes	f	\N	\N	\N
4610	430	\N	3	Known neurological condition	f	\N	\N	\N
4611	430	\N	4	Previous workup for weakness	f	\N	\N	\N
4612	430	\N	5	Family history of similar symptoms	f	\N	\N	\N
4613	431	\N	1	HMG-CoA reductase inhibitors (statins)	f	\N	\N	\N
4614	431	\N	2	Beta blockers	f	\N	\N	\N
4615	431	\N	3	Calcium channel blockers	f	\N	\N	\N
4616	431	\N	4	Diuretics	f	\N	\N	\N
4617	431	\N	5	ACE inhibitors/ARBs	f	\N	\N	\N
4618	431	\N	6	Anticoagulants/antiplatelets	f	\N	\N	\N
4619	431	\N	7	Corticosteroids	f	\N	\N	\N
4620	431	\N	8	NSAIDs	f	\N	\N	\N
4621	431	\N	9	Opioid analgesics	f	\N	\N	\N
4622	431	\N	10	Sedatives/hypnotics	f	\N	\N	\N
4623	431	\N	11	Stimulants	f	\N	\N	\N
4624	431	\N	12	Antidepressants	f	\N	\N	\N
4625	431	\N	13	Antipsychotics	f	\N	\N	\N
4626	431	\N	14	Anticonvulsants	f	\N	\N	\N
4627	431	\N	15	Antibiotics	f	\N	\N	\N
4628	431	4627	1	Aminoglycosides	f	\N	\N	\N
4629	431	4627	2	Fluoroquinolones	f	\N	\N	\N
4630	431	\N	16	Chemotherapeutic agents	f	\N	\N	\N
4631	431	\N	17	Immunosuppressants	f	\N	\N	\N
4632	431	\N	18	Thyroid medications	f	\N	\N	\N
4633	431	\N	19	Insulin/oral hypoglycemics	f	\N	\N	\N
4634	431	\N	20	Acetylcholinesterase inhibitors	f	\N	\N	\N
4635	431	\N	21	Recent medication changes	f	\N	\N	\N
4636	431	\N	22	Recent medication discontinuation	f	\N	\N	\N
4637	432	\N	1	Aminoglycosides	f	\N	\N	\N
4638	432	\N	2	Fluoroquinolones	f	\N	\N	\N
4639	432	\N	3	Beta blockers	f	\N	\N	\N
4640	432	\N	4	Phenytoin	f	\N	\N	\N
4641	432	\N	5	Lithium	f	\N	\N	\N
4642	432	\N	6	Procainamide	f	\N	\N	\N
4643	432	\N	7	Penicillamine	f	\N	\N	\N
4644	432	\N	8	Botulinum toxin	f	\N	\N	\N
4645	433	\N	1	Statins (HMG-CoA reductase inhibitors)	f	\N	\N	\N
4646	433	\N	2	Colchicine	f	\N	\N	\N
4647	433	\N	3	Corticosteroids	f	\N	\N	\N
4648	433	\N	4	Chloroquine/hydroxychloroquine	f	\N	\N	\N
4649	433	\N	5	Amiodarone	f	\N	\N	\N
4650	433	\N	6	Zidovudine (AZT)	f	\N	\N	\N
4651	433	\N	7	Ipecac	f	\N	\N	\N
4652	433	\N	8	Alcohol	f	\N	\N	\N
4653	434	\N	1	Medication list reviewed	f	\N	\N	\N
4654	434	\N	2	Potential drug interactions identified	f	\N	\N	\N
4655	434	\N	3	Medications that may worsen current condition identified	f	\N	\N	\N
4656	434	\N	4	Medication adherence assessed	f	\N	\N	\N
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, chapter_id, category_id, title, display_order) FROM stdin;
1	11	2	Neurological	1
2	11	2	Respiratory	2
3	11	2	Cardiovascular	3
4	11	2	Methemoglobinemia Severity Indicators	4
5	11	2	Pediatric Specific	5
6	11	2	Other Critical Indicators	6
7	11	15	Primary Diagnosis	1
8	11	15	Secondary Diagnoses	2
9	11	15	Clinical Stability Assessment	3
10	11	15	Response to Initial Interventions	4
11	11	15	Disease Severity Assessment	5
12	11	15	Etiology Factors	6
13	11	15	Decision-Making Complexity	7
14	11	15	Risk Stratification	8
15	11	15	Prognostic Indicators	9
16	11	6	Source of Information	1
17	11	6	Reliability of Historian	2
18	11	6	Collateral Information About Onset	3
19	11	6	Collateral Information About Symptoms	4
20	11	6	Pediatric-Specific Collateral Information	5
21	11	6	Environmental Exposures Reported	6
22	11	6	Family History Information	7
23	11	6	Baseline Status Information	8
24	11	8	Peripheral Cyanosis	1
25	11	8	Central Cyanosis	2
26	11	8	Other Important Considerations	3
27	11	17	Disposition Decision	1
28	11	17	Admission Criteria	2
29	11	17	Discharge Criteria	3
30	11	17	Follow-up Appointments	4
31	11	17	Home Care Needs	5
32	11	17	Medication Instructions	6
33	11	17	Additional Discharge Planning	7
34	11	17	Documentation Requirements	8
35	11	14	General Characteristics	1
36	11	14	Rhythm Analysis	2
37	11	14	Ischemic Changes	3
38	11	14	Chamber Abnormalities	4
39	11	14	Other ECG Findings	5
40	11	14	Electrolyte/Metabolic Findings	6
41	11	14	Pulmonary Findings	7
42	11	14	Comparison	8
43	11	1	Chief Complaint	1
44	11	1	Symptom Characteristics	2
45	11	1	Exposure History	3
46	11	1	Special Population Considerations	4
47	11	12	Chest Radiography	1
48	11	12	Computed Tomography	2
49	11	12	Ultrasound	3
50	11	12	Ventilation-Perfusion (V/Q) Scan	4
51	11	12	Magnetic Resonance Imaging (MRI)	5
52	11	12	Angiography	6
53	11	12	Nuclear Medicine	7
54	11	12	Other Imaging Studies	8
55	11	11	Complete Blood Count	1
56	11	11	White Blood Cell Differential	2
57	11	11	Peripheral Blood Smear	3
58	11	11	Blood Chemistry	4
59	11	11	Arterial Blood Gas	5
60	11	11	CO-Oximetry	6
61	11	11	Coagulation Studies	7
62	11	11	Cardiac Markers	8
63	11	11	Special Hematology Tests	9
64	11	11	Toxicology	10
65	11	11	Microbiology	11
66	11	11	Other Laboratory Studies	12
67	11	11	Simple Diagnostic Tests	13
68	11	9	Cardiopulmonary History	1
69	11	9	Hematologic History	2
70	11	9	Vascular History	3
71	11	9	Neurologic History	4
72	11	9	Endocrine History	5
73	11	9	Gastrointestinal History	6
74	11	9	Renal History	7
75	11	9	Surgical History	8
76	11	9	Other Medical History	9
77	11	18	Diagnosis Explanation	1
78	11	18	Medication Education	2
79	11	18	Avoidance Measures	3
80	11	18	Home Monitoring Instructions	4
81	11	18	Activity Guidelines	5
82	11	18	Dietary Recommendations	6
83	11	18	When to Seek Medical Attention	7
84	11	18	Genetic Counseling (if applicable)	8
85	11	18	Follow-up Instructions	9
86	11	18	Provided Resources	10
87	11	18	Documentation of Understanding	11
88	11	10	Vital Signs	1
89	11	10	General Appearance	2
90	11	10	Skin	3
91	11	10	HEENT	4
92	11	10	Respiratory	5
93	11	10	Cardiovascular	6
94	11	10	Abdomen	7
95	11	10	Extremities	8
96	11	10	Neurological	9
97	11	16	Immediate Interventions	1
98	11	16	Diagnostic Plan	2
99	11	16	Medication Plan	3
100	11	16	Consultation Plan	4
101	11	16	Monitoring Plan	5
102	11	16	Follow-up Studies	6
103	11	16	Supportive Care	7
104	11	16	Prophylaxis	8
105	11	16	Additional Treatment Considerations	9
106	11	5	Constitutional	1
107	11	5	Skin	2
108	11	5	HEENT	3
109	11	5	Respiratory	4
110	11	5	Cardiovascular	5
111	11	5	Gastrointestinal	6
112	11	5	Genitourinary	7
113	11	5	Musculoskeletal	8
114	11	5	Neurological	9
115	11	5	Psychiatric	10
116	11	5	Hematologic/Lymphatic	11
117	11	5	Endocrine	12
118	11	5	Allergic/Immunologic	13
119	11	7	General Risk Factors	1
120	11	7	Cardiovascular Risk Factors	2
121	11	7	Risk Factors for Methemoglobinemia	3
122	11	7	Risk Factors for Sulfhemoglobinemia	4
123	11	7	Risk Factors for Respiratory Disease	5
124	11	7	Risk Factors for Congenital Heart Disease	6
125	11	7	Risk Factors for Peripheral Cyanosis	7
126	11	13	Pulmonary Function Tests	1
127	11	13	Hemoglobin Analysis	2
128	11	13	Oxygen Dissociation Testing	3
129	11	13	Cardiac Testing	4
130	11	13	Neurologic Testing	5
131	11	13	Vascular Testing	6
132	11	13	Sleep Studies	7
133	11	13	Blood Toxicology	8
134	11	13	Specialized Pulmonary Tests	9
135	11	13	Bedside Tests	10
136	22	2	High-Risk Features	1
137	22	2	Critical Diagnoses To Consider	2
138	22	2	Emergent Diagnostic Factors	3
139	22	2	Concerning Cardiac Symptoms	4
140	22	2	Concerning Neurological Symptoms	5
141	22	2	Concerning Abdominal/GI Symptoms	6
142	22	15	Syncope Classification	1
143	22	15	Diagnostic Certainty	2
144	22	15	Risk Stratification	3
145	22	15	Canadian Syncope Risk Score Calculation	4
146	22	15	FAINT Score Calculation	5
147	22	15	San Francisco Syncope Rule Assessment	6
148	22	15	Clinical Impression	7
149	22	15	Degree of Functional Impairment	8
150	22	15	Injury Assessment	9
151	22	6	Witness Account	1
152	22	6	Description of Episode (From Observer)	2
153	22	6	Pre-Episode Observations	3
154	22	6	Episode Characteristics	4
155	22	6	Movement During Episode	5
156	22	6	Autonomic Features	6
157	22	6	Recovery Characteristics	7
158	22	6	EMS/First Responder Report	8
159	22	8	Reflex (Neurally Mediated) Syncope	1
160	22	8	Orthostatic Syncope	2
161	22	8	Cardiac Syncope	3
162	22	8	Cerebrovascular Causes	4
163	22	8	Metabolic/Toxic Causes	5
164	22	8	Other Medical Causes	6
165	22	8	Syncope Mimics	7
166	22	17	Primary Disposition Decision	1
167	22	17	Disposition Rationale	2
168	22	17	Discharge Considerations	3
169	22	17	Observation Unit Considerations	4
170	22	17	Hospital Admission Considerations	5
171	22	17	Telemetry Monitoring Indications	6
172	22	17	Intensive Care Unit Indications	7
173	22	17	Transfer Considerations	8
174	22	14	Basic ECG Parameters	1
175	22	14	Rhythm	2
176	22	14	Conduction Abnormalities	3
177	22	14	Tachyarrhythmias	4
178	22	14	Ischemia/Infarction	5
179	22	14	Other ECG Findings	6
180	22	14	Serial ECG Changes	7
181	22	14	Cardiac Monitor Findings (if available)	8
182	22	12	Chest X-ray	1
183	22	12	Head CT	2
184	22	12	CT Pulmonary Angiogram	3
185	22	12	CT Abdomen/Pelvis	4
186	22	12	CT Angiogram of Chest	5
187	22	12	MRI Brain	6
188	22	12	MR Angiography	7
189	22	12	Carotid Ultrasound	8
190	22	12	Abdominal Ultrasound	9
191	22	12	Pelvic Ultrasound (if applicable)	10
192	22	11	Complete Blood Count	1
193	22	11	Basic Metabolic Panel	2
194	22	11	Cardiac Biomarkers	3
195	22	11	Coagulation Studies	4
196	22	11	Additional Electrolytes	5
197	22	11	Liver Function Tests	6
198	22	11	Toxicology Screen	7
199	22	11	Pregnancy Test	8
200	22	11	Thyroid Function Tests	9
201	22	11	Arterial Blood Gas	10
202	22	11	Urinalysis	11
203	22	11	Other Laboratory Tests	12
204	22	18	General Syncope Information	1
205	22	18	Safety Considerations	2
206	22	18	Specific Cause Education (if identified)	3
207	22	18	Prodromal Symptom Recognition	4
208	22	18	Physical Counterpressure Maneuvers	5
209	22	18	Lifestyle Modifications	6
210	22	18	Medication Education	7
211	22	18	Follow-up Care	8
212	22	18	Warning Signs Requiring Immediate Attention	9
213	22	18	Family Education	10
214	22	10	Vital Signs	1
215	22	10	Orthostatic Vital Signs	2
216	22	10	General Appearance	3
217	22	10	Head, Eyes, Ears, Nose, Throat	4
218	22	10	Cardiovascular	5
219	22	10	Pulmonary	6
220	22	10	Abdominal	7
221	22	10	Neurological	8
222	22	10	Extremities	9
223	22	10	Skin	10
224	22	10	Rectal Examination (if indicated)	11
225	22	16	Immediate Management	1
226	22	16	Additional Testing	2
227	22	16	Medication Recommendations	3
228	22	16	Lifestyle Modifications	4
229	22	16	Cardiac Intervention Considerations	5
230	22	16	Follow-up Care	6
231	22	16	Preventive Measures	7
232	22	16	Special Considerations	8
233	22	7	Demographic Risk Factors	1
234	22	7	Cardiac Risk Factors	2
235	22	7	Vascular Risk Factors	3
236	22	7	Pulmonary Embolism Risk Factors	4
237	22	7	Orthostatic Hypotension Risk Factors	5
238	22	7	Canadian Syncope Risk Score Factors	6
239	22	7	San Francisco Syncope Rule Factors	7
240	22	7	FAINT Score Factors	8
241	22	13	Bedside Ultrasonography	1
242	22	13	Tilt Table Test	2
243	22	13	Carotid Sinus Massage	3
244	22	13	Stress Test	4
245	22	13	Ambulatory Cardiac Monitoring	5
246	22	13	Electroencephalogram (EEG)	6
247	22	13	Cardiac Catheterization	7
248	22	13	Electrophysiology Study	8
249	33	2	Neurological Red Flags	1
250	33	2	Vital Sign Abnormalities	2
251	33	2	Metabolic Emergencies	3
252	33	2	Toxic Presentations	4
253	33	2	Post-Cardiac Arrest	5
254	33	2	Systemic Signs	6
255	33	15	Primary Diagnosis	1
256	33	15	Differential Diagnoses	2
257	33	15	Etiology	3
258	33	15	Clinical Severity	4
259	33	15	Prognostic Factors	5
260	33	15	Complications	6
261	33	15	Functional Assessment	7
262	33	15	Clinical Trajectory	8
263	33	6	Source of Collateral Information	1
264	33	6	Pre-Event Status	2
265	33	6	Event Information	3
266	33	6	Information About Medical History	4
267	33	6	Information About Medications	5
268	33	6	Information About Substance Use	6
269	33	6	Social Context	7
270	33	6	Advance Directives	8
271	33	4	Dietary Intake	1
272	33	4	Hydration Status	2
273	33	4	Weight Changes	3
274	33	4	Dietary Restrictions	4
275	33	4	Alcohol Consumption	5
276	33	4	Nutritional Concerns	6
277	33	4	Recent Dietary Events	7
278	33	8	Vascular	1
279	33	8	Infectious/Inflammatory	2
280	33	8	Traumatic	3
281	33	8	Metabolic/Toxic	4
282	33	8	Seizure-Related	5
283	33	8	Neoplastic	6
284	33	8	Autoimmune/Inflammatory	7
285	33	8	Other Neurological	8
286	33	8	Psychiatric	9
287	33	8	Post-Resuscitation	10
288	33	17	Level of Care	1
289	33	17	Transfer Considerations	2
290	33	17	Discharge Planning (if applicable)	3
291	33	17	Follow-up Plan	4
292	33	17	Transportation	5
293	33	17	Barriers to Disposition	6
294	33	17	Communication	7
295	33	14	Basic ECG Data	1
296	33	14	Arrhythmias	2
297	33	14	Ischemic Changes	3
298	33	14	Other ECG Findings	4
299	33	14	Drug Effect Patterns	5
300	33	14	Electrolyte Abnormality Patterns	6
301	33	14	Comparison	7
302	33	14	Clinical Correlation	8
303	33	1	Chief Complaint	1
304	33	1	Onset and Duration	2
305	33	1	Associated Symptoms	3
306	33	1	Prior Episodes	4
307	33	1	Precipitating Factors	5
308	33	1	Alleviating Factors	6
309	33	1	Witnessed Information (if applicable)	7
310	33	12	Head CT (Non-contrast)	1
311	33	12	CT Angiography (Head/Neck)	2
312	33	12	MRI Brain	3
313	33	12	Chest X-ray	4
314	33	12	CT Chest	5
315	33	12	CT Abdomen/Pelvis	6
316	33	12	Ultrasound	7
317	33	12	Transcranial Doppler	8
318	33	12	Carotid Duplex	9
319	33	12	Other Imaging	10
320	33	11	Point of Care Testing	1
321	33	11	Complete Blood Count	2
322	33	11	Basic Metabolic Panel	3
323	33	11	Liver Function Tests	4
324	33	11	Arterial Blood Gas	5
325	33	11	Toxicology	6
326	33	11	Endocrine/Metabolic	7
327	33	11	Infectious Disease	8
328	33	11	Inflammatory/Autoimmune	9
329	33	11	Cardiac	10
330	33	3	Current Medications	1
331	33	3	Medication Changes	2
332	33	3	Over-the-Counter Medications	3
333	33	3	Medication Adherence	4
334	33	3	Medication Allergies/Adverse Effects	5
335	33	3	Recent Administration (Emergency Setting)	6
336	33	9	Neurological History	1
337	33	9	Cardiovascular History	2
338	33	9	Pulmonary History	3
339	33	9	Endocrine History	4
340	33	9	Renal History	5
341	33	9	Hepatic History	6
342	33	9	Gastrointestinal History	7
343	33	9	Hematologic History	8
344	33	9	Infectious Disease History	9
345	33	9	Psychiatric History	10
346	33	9	Surgical History	11
347	33	18	Diagnosis Education	1
348	33	18	Treatment Education	2
349	33	18	Warning Signs Education	3
350	33	18	Lifestyle Modifications	4
351	33	18	Self-Care Instructions	5
352	33	18	Support Resources	6
353	33	18	Follow-up Instructions	7
354	33	18	Documentation	8
355	33	10	Vital Signs	1
356	33	10	General Appearance	2
357	33	10	Level of Consciousness (GCS)	3
358	33	10	FOUR Score	4
359	33	10	HEENT	5
360	33	10	Neck	6
361	33	10	Cardiovascular	7
362	33	10	Respiratory	8
363	33	10	Abdominal	9
364	33	10	Skin	10
365	33	10	Neurological Exam	11
366	33	10	Brainstem Reflexes	12
367	33	16	Diagnostic Plan	1
368	33	16	Therapeutic Plan	2
369	33	16	Monitoring Plan	3
370	33	16	Rehabilitation Plan	4
371	33	16	Coordination of Care	5
372	33	16	Advanced Care Planning	6
373	33	16	Contingency Plan	7
374	33	5	Neurological System	1
375	33	5	Cardiovascular System	2
376	33	5	Respiratory System	3
377	33	5	Gastrointestinal System	4
378	33	5	Genitourinary System	5
379	33	5	Endocrine System	6
380	33	5	Hematologic System	7
381	33	5	Musculoskeletal System	8
382	33	5	Skin	9
383	33	5	Psychiatric	10
384	33	5	Constitutional	11
385	33	7	Neurological Risk Factors	1
386	33	7	Cardiovascular Risk Factors	2
387	33	7	Metabolic Risk Factors	3
388	33	7	Substance-Related Risk Factors	4
389	33	7	Infectious Disease Risk Factors	5
390	33	7	Environmental Risk Factors	6
391	33	7	Traumatic Risk Factors	7
392	33	7	Psychiatric Risk Factors	8
393	33	7	Genetic Risk Factors	9
394	33	13	Electroencephalogram (EEG)	1
395	33	13	Lumbar Puncture	2
396	33	13	Neurocognitive Assessment	3
397	33	13	Evoked Potentials	4
398	33	13	Neuro-ophthalmologic Tests	5
399	33	13	Sleep Studies	6
400	33	13	Autonomic Testing	7
401	33	13	Neurogenetic Testing	8
402	33	13	Neuropsychological Testing	9
403	33	13	Other Special Tests	10
404	167	4	Current Intake	1
405	167	4	Recent Changes	2
406	167	4	Hydration Status	3
407	167	4	GI Symptoms Affecting Intake	4
408	167	4	Food Associations	5
409	167	4	Nutritional Considerations	6
410	167	1	Onset and Duration	1
411	167	1	Fever Characteristics	2
412	167	1	Associated Symptoms	3
413	167	1	Environmental Factors	4
414	167	1	Fever Response	5
415	167	1	Baseline Status	6
416	167	3	Current Antimicrobials	1
417	167	3	Antipyretics	2
418	167	3	Immunosuppressants	3
419	167	3	Regular Medications	4
420	167	3	Medication Response	5
421	167	3	Medication Allergies	6
422	178	4	General Dietary History	1
423	178	4	Hydration Status	2
424	178	4	Swallowing Function	3
425	178	4	Nutritional Risk Factors	4
426	178	4	Metabolic Considerations	5
427	178	1	Onset and Progression	1
428	178	1	Pattern of Weakness	2
429	178	1	Associated Symptoms	3
430	178	1	Prior Episodes	4
431	178	3	Current Medications	1
432	178	3	NMJ-Affecting Medications	2
433	178	3	Potential Myopathy-Causing Medications	3
434	178	3	Medication Reconciliation	4
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-03-11 15:23:53
20211116045059	2025-03-11 15:23:53
20211116050929	2025-03-11 15:23:53
20211116051442	2025-03-11 15:23:53
20211116212300	2025-03-11 15:23:53
20211116213355	2025-03-11 15:23:53
20211116213934	2025-03-11 15:23:53
20211116214523	2025-03-11 15:23:53
20211122062447	2025-03-11 15:23:54
20211124070109	2025-03-11 15:23:54
20211202204204	2025-03-11 15:23:54
20211202204605	2025-03-11 15:23:54
20211210212804	2025-03-11 15:23:54
20211228014915	2025-03-11 15:23:54
20220107221237	2025-03-11 15:23:54
20220228202821	2025-03-11 15:23:55
20220312004840	2025-03-11 15:23:55
20220603231003	2025-03-11 15:23:55
20220603232444	2025-03-11 15:23:55
20220615214548	2025-03-11 15:23:55
20220712093339	2025-03-11 15:23:55
20220908172859	2025-03-11 15:23:55
20220916233421	2025-03-11 15:23:55
20230119133233	2025-03-11 15:23:55
20230128025114	2025-03-11 15:23:56
20230128025212	2025-03-11 15:23:56
20230227211149	2025-03-11 15:23:56
20230228184745	2025-03-11 15:23:56
20230308225145	2025-03-11 15:23:56
20230328144023	2025-03-11 15:23:56
20231018144023	2025-03-11 15:23:56
20231204144023	2025-03-11 15:23:56
20231204144024	2025-03-11 15:23:56
20231204144025	2025-03-11 15:23:57
20240108234812	2025-03-11 15:23:57
20240109165339	2025-03-11 15:23:57
20240227174441	2025-03-11 15:23:57
20240311171622	2025-03-11 15:23:57
20240321100241	2025-03-11 15:23:57
20240401105812	2025-03-11 15:23:58
20240418121054	2025-03-11 15:23:58
20240523004032	2025-03-11 15:23:58
20240618124746	2025-03-11 15:23:58
20240801235015	2025-03-11 15:23:58
20240805133720	2025-03-11 15:23:58
20240827160934	2025-03-11 15:23:59
20240919163303	2025-03-11 15:23:59
20240919163305	2025-03-11 15:23:59
20241019105805	2025-03-11 15:23:59
20241030150047	2025-03-11 15:23:59
20241108114728	2025-03-11 15:23:59
20241121104152	2025-03-11 15:24:00
20241130184212	2025-03-11 15:24:00
20241220035512	2025-03-11 15:24:00
20241220123912	2025-03-11 15:24:00
20241224161212	2025-03-11 15:24:00
20250107150512	2025-03-11 15:24:00
20250110162412	2025-03-11 15:24:00
20250123174212	2025-03-11 15:24:00
20250128220012	2025-03-11 15:24:00
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-03-11 15:08:50.292426
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-03-11 15:08:50.303948
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-03-11 15:08:50.309531
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-03-11 15:08:50.343286
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-03-11 15:08:50.380938
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-03-11 15:08:50.389465
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-03-11 15:08:50.39627
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-03-11 15:08:50.41002
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-03-11 15:08:50.417182
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-03-11 15:08:50.424048
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-03-11 15:08:50.436426
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-03-11 15:08:50.453558
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-03-11 15:08:50.462949
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-03-11 15:08:50.469384
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-03-11 15:08:50.477476
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-03-11 15:08:50.513729
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-03-11 15:08:50.523529
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-03-11 15:08:50.530391
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-03-11 15:08:50.537633
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-03-11 15:08:50.545001
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-03-11 15:08:50.552636
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-03-11 15:08:50.564697
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-03-11 15:08:50.604634
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-03-11 15:08:50.635056
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-03-11 15:08:50.642028
25	custom-metadata	67eb93b7e8d401cafcdc97f9ac779e71a79bfe03	2025-03-11 15:08:50.648692
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
\.


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: chapters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chapters_id_seq', 178, true);


--
-- Name: checklist_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.checklist_items_id_seq', 4656, true);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 434, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chapters chapters_chapter_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_chapter_number_key UNIQUE (chapter_number);


--
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- Name: checklist_items checklist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_pkey PRIMARY KEY (id);


--
-- Name: sections sections_chapter_id_category_id_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_chapter_id_category_id_title_key UNIQUE (chapter_id, category_id, title);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: checklist_items checklist_items_parent_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_parent_item_id_fkey FOREIGN KEY (parent_item_id) REFERENCES public.checklist_items(id);


--
-- Name: checklist_items checklist_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id);


--
-- Name: sections sections_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: sections sections_chapter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT ALL ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.try_cast_double(inp text) FROM postgres;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.url_decode(data text) FROM postgres;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.url_encode(data bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: postgres
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_keygen(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_keygen() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO postgres;
GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE decrypted_key; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.decrypted_key TO pgsodium_keyholder;


--
-- Name: TABLE masking_rule; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.masking_rule TO pgsodium_keyholder;


--
-- Name: TABLE mask_columns; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.mask_columns TO pgsodium_keyholder;


--
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO service_role;


--
-- Name: SEQUENCE categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.categories_id_seq TO anon;
GRANT ALL ON SEQUENCE public.categories_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.categories_id_seq TO service_role;


--
-- Name: TABLE chapters; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.chapters TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.chapters TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.chapters TO service_role;


--
-- Name: SEQUENCE chapters_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.chapters_id_seq TO anon;
GRANT ALL ON SEQUENCE public.chapters_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.chapters_id_seq TO service_role;


--
-- Name: TABLE checklist_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.checklist_items TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.checklist_items TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.checklist_items TO service_role;


--
-- Name: SEQUENCE checklist_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.checklist_items_id_seq TO anon;
GRANT ALL ON SEQUENCE public.checklist_items_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.checklist_items_id_seq TO service_role;


--
-- Name: TABLE sections; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.sections TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.sections TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.sections TO service_role;


--
-- Name: SEQUENCE sections_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.sections_id_seq TO anon;
GRANT ALL ON SEQUENCE public.sections_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.sections_id_seq TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE migrations; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON SEQUENCES TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON SEQUENCES TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON FUNCTIONS TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO postgres;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

