PGDMP                  
    |           restaurante    16.4    16.4 �    m           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            n           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            o           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            p           1262    16912    restaurante    DATABASE     ~   CREATE DATABASE restaurante WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE restaurante;
                postgres    false            �            1259    33483    bodega    TABLE     9  CREATE TABLE public.bodega (
    id integer NOT NULL,
    proveedor character varying(100) NOT NULL,
    producto character varying(100) NOT NULL,
    cantidad integer NOT NULL,
    valor_unitario numeric(10,2) NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    transaccion_finanzas_id integer
);
    DROP TABLE public.bodega;
       public         heap    postgres    false            �            1259    33482    bodega_id_seq    SEQUENCE     �   CREATE SEQUENCE public.bodega_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.bodega_id_seq;
       public          postgres    false    246            q           0    0    bodega_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.bodega_id_seq OWNED BY public.bodega.id;
          public          postgres    false    245            �            1259    25298    carrito_compras    TABLE     �  CREATE TABLE public.carrito_compras (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad integer DEFAULT 1,
    estado_id integer DEFAULT 1 NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT carrito_compras_cantidad_check CHECK ((cantidad > 0))
);
 #   DROP TABLE public.carrito_compras;
       public         heap    postgres    false            �            1259    25297    carrito_compras_id_seq    SEQUENCE     �   CREATE SEQUENCE public.carrito_compras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.carrito_compras_id_seq;
       public          postgres    false    234            r           0    0    carrito_compras_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.carrito_compras_id_seq OWNED BY public.carrito_compras.id;
          public          postgres    false    233            �            1259    25399    comandas    TABLE     �   CREATE TABLE public.comandas (
    id integer NOT NULL,
    compra_id integer,
    producto_id integer,
    cantidad integer,
    tiempo_preparacion integer,
    estado_id integer,
    fecha_comanda timestamp without time zone DEFAULT now()
);
    DROP TABLE public.comandas;
       public         heap    postgres    false            �            1259    25398    comandas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comandas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.comandas_id_seq;
       public          postgres    false    240            s           0    0    comandas_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.comandas_id_seq OWNED BY public.comandas.id;
          public          postgres    false    239            �            1259    25364    compras    TABLE       CREATE TABLE public.compras (
    id integer NOT NULL,
    usuario_id integer,
    mesa_id integer,
    total numeric(10,2),
    estado_id integer,
    fecha_compra timestamp without time zone DEFAULT now(),
    tiempo_preparacion integer,
    transaccion_finanzas_id integer
);
    DROP TABLE public.compras;
       public         heap    postgres    false            �            1259    25363    compras_id_seq    SEQUENCE     �   CREATE SEQUENCE public.compras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.compras_id_seq;
       public          postgres    false    236            t           0    0    compras_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.compras_id_seq OWNED BY public.compras.id;
          public          postgres    false    235            �            1259    25382    compras_productos    TABLE     �   CREATE TABLE public.compras_productos (
    id integer NOT NULL,
    compra_id integer,
    producto_id integer,
    cantidad integer,
    precio_unitario numeric(10,2),
    precio_total numeric(10,2)
);
 %   DROP TABLE public.compras_productos;
       public         heap    postgres    false            �            1259    25381    compras_productos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.compras_productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.compras_productos_id_seq;
       public          postgres    false    238            u           0    0    compras_productos_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.compras_productos_id_seq OWNED BY public.compras_productos.id;
          public          postgres    false    237            �            1259    16966    estados    TABLE     R   CREATE TABLE public.estados (
    id bigint NOT NULL,
    nombre text NOT NULL
);
    DROP TABLE public.estados;
       public         heap    postgres    false            �            1259    16965    estados_id_seq    SEQUENCE     �   ALTER TABLE public.estados ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    224            �            1259    33473    finanzas    TABLE     �   CREATE TABLE public.finanzas (
    id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    concepto text NOT NULL,
    monto numeric(10,2) NOT NULL,
    fecha timestamp without time zone DEFAULT now()
);
    DROP TABLE public.finanzas;
       public         heap    postgres    false            �            1259    33472    finanzas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.finanzas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.finanzas_id_seq;
       public          postgres    false    244            v           0    0    finanzas_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.finanzas_id_seq OWNED BY public.finanzas.id;
          public          postgres    false    243            �            1259    25220    mesas    TABLE     �   CREATE TABLE public.mesas (
    id integer NOT NULL,
    numero integer NOT NULL,
    estado_id integer,
    ubicacion character varying(100),
    capacidad integer NOT NULL
);
    DROP TABLE public.mesas;
       public         heap    postgres    false            �            1259    25219    mesas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.mesas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.mesas_id_seq;
       public          postgres    false    228            w           0    0    mesas_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.mesas_id_seq OWNED BY public.mesas.id;
          public          postgres    false    227            �            1259    25274 	   productos    TABLE     �  CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    categoria character varying(50),
    estado_id integer DEFAULT 1 NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    imagen_url text,
    CONSTRAINT productos_precio_check CHECK ((precio >= (0)::numeric))
);
    DROP TABLE public.productos;
       public         heap    postgres    false            �            1259    25273    productos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.productos_id_seq;
       public          postgres    false    232            x           0    0    productos_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;
          public          postgres    false    231            �            1259    33459    recetas    TABLE     �   CREATE TABLE public.recetas (
    id integer NOT NULL,
    instrucciones text NOT NULL,
    ingredientes text NOT NULL,
    producto_id integer NOT NULL
);
    DROP TABLE public.recetas;
       public         heap    postgres    false            �            1259    33458    recetas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.recetas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.recetas_id_seq;
       public          postgres    false    242            y           0    0    recetas_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.recetas_id_seq OWNED BY public.recetas.id;
          public          postgres    false    241            �            1259    25232    reservas    TABLE     �   CREATE TABLE public.reservas (
    id integer NOT NULL,
    usuario_id integer,
    mesa_id integer,
    fecha_reserva timestamp without time zone DEFAULT now(),
    estado_id integer
);
    DROP TABLE public.reservas;
       public         heap    postgres    false            �            1259    25231    reservas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reservas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.reservas_id_seq;
       public          postgres    false    230            z           0    0    reservas_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.reservas_id_seq OWNED BY public.reservas.id;
          public          postgres    false    229            �            1259    16981    respuestas_soporte    TABLE     �   CREATE TABLE public.respuestas_soporte (
    id bigint NOT NULL,
    soporte_id bigint,
    administrador_id bigint,
    mensaje_respuesta text,
    respondido_en timestamp with time zone DEFAULT now(),
    estado_id bigint
);
 &   DROP TABLE public.respuestas_soporte;
       public         heap    postgres    false            �            1259    16980    respuestas_soporte_id_seq    SEQUENCE     �   ALTER TABLE public.respuestas_soporte ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.respuestas_soporte_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    226            �            1259    16914    roles    TABLE     P   CREATE TABLE public.roles (
    id bigint NOT NULL,
    nombre text NOT NULL
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    16913    roles_id_seq    SEQUENCE     �   ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    216            �            1259    16951    soporte    TABLE     �   CREATE TABLE public.soporte (
    id bigint NOT NULL,
    usuario_id bigint,
    mensaje text NOT NULL,
    creado_en timestamp without time zone
);
    DROP TABLE public.soporte;
       public         heap    postgres    false            �            1259    16950    soporte_id_seq    SEQUENCE     �   ALTER TABLE public.soporte ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.soporte_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    222            �            1259    16935    usuario_roles    TABLE     h   CREATE TABLE public.usuario_roles (
    id bigint NOT NULL,
    usuario_id bigint,
    rol_id bigint
);
 !   DROP TABLE public.usuario_roles;
       public         heap    postgres    false            �            1259    16934    usuario_roles_id_seq    SEQUENCE     �   ALTER TABLE public.usuario_roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuario_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220            �            1259    16922    usuarios    TABLE     C  CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    nombre text NOT NULL,
    email text NOT NULL,
    "contraseña" text NOT NULL,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now(),
    activo boolean DEFAULT true,
    apellido character varying(50)
);
    DROP TABLE public.usuarios;
       public         heap    postgres    false            �            1259    16921    usuarios_id_seq    SEQUENCE     �   ALTER TABLE public.usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218            }           2604    33486 	   bodega id    DEFAULT     f   ALTER TABLE ONLY public.bodega ALTER COLUMN id SET DEFAULT nextval('public.bodega_id_seq'::regclass);
 8   ALTER TABLE public.bodega ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    246    245    246            p           2604    25301    carrito_compras id    DEFAULT     x   ALTER TABLE ONLY public.carrito_compras ALTER COLUMN id SET DEFAULT nextval('public.carrito_compras_id_seq'::regclass);
 A   ALTER TABLE public.carrito_compras ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    234    234            x           2604    25402    comandas id    DEFAULT     j   ALTER TABLE ONLY public.comandas ALTER COLUMN id SET DEFAULT nextval('public.comandas_id_seq'::regclass);
 :   ALTER TABLE public.comandas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    240    240            u           2604    25367 
   compras id    DEFAULT     h   ALTER TABLE ONLY public.compras ALTER COLUMN id SET DEFAULT nextval('public.compras_id_seq'::regclass);
 9   ALTER TABLE public.compras ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    236    236            w           2604    25385    compras_productos id    DEFAULT     |   ALTER TABLE ONLY public.compras_productos ALTER COLUMN id SET DEFAULT nextval('public.compras_productos_id_seq'::regclass);
 C   ALTER TABLE public.compras_productos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    238    237    238            {           2604    33476    finanzas id    DEFAULT     j   ALTER TABLE ONLY public.finanzas ALTER COLUMN id SET DEFAULT nextval('public.finanzas_id_seq'::regclass);
 :   ALTER TABLE public.finanzas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    243    244    244            i           2604    25223    mesas id    DEFAULT     d   ALTER TABLE ONLY public.mesas ALTER COLUMN id SET DEFAULT nextval('public.mesas_id_seq'::regclass);
 7   ALTER TABLE public.mesas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    228    228            l           2604    25277    productos id    DEFAULT     l   ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);
 ;   ALTER TABLE public.productos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    232    232            z           2604    33462 
   recetas id    DEFAULT     h   ALTER TABLE ONLY public.recetas ALTER COLUMN id SET DEFAULT nextval('public.recetas_id_seq'::regclass);
 9   ALTER TABLE public.recetas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    242    241    242            j           2604    25235    reservas id    DEFAULT     j   ALTER TABLE ONLY public.reservas ALTER COLUMN id SET DEFAULT nextval('public.reservas_id_seq'::regclass);
 :   ALTER TABLE public.reservas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    230    230            j          0    33483    bodega 
   TABLE DATA           s   COPY public.bodega (id, proveedor, producto, cantidad, valor_unitario, fecha, transaccion_finanzas_id) FROM stdin;
    public          postgres    false    246   y�       ^          0    25298    carrito_compras 
   TABLE DATA           v   COPY public.carrito_compras (id, usuario_id, producto_id, cantidad, estado_id, creado_en, actualizado_en) FROM stdin;
    public          postgres    false    234   H�       d          0    25399    comandas 
   TABLE DATA           v   COPY public.comandas (id, compra_id, producto_id, cantidad, tiempo_preparacion, estado_id, fecha_comanda) FROM stdin;
    public          postgres    false    240   ҟ       `          0    25364    compras 
   TABLE DATA           �   COPY public.compras (id, usuario_id, mesa_id, total, estado_id, fecha_compra, tiempo_preparacion, transaccion_finanzas_id) FROM stdin;
    public          postgres    false    236   Ҧ       b          0    25382    compras_productos 
   TABLE DATA           p   COPY public.compras_productos (id, compra_id, producto_id, cantidad, precio_unitario, precio_total) FROM stdin;
    public          postgres    false    238   ��       T          0    16966    estados 
   TABLE DATA           -   COPY public.estados (id, nombre) FROM stdin;
    public          postgres    false    224   �       h          0    33473    finanzas 
   TABLE DATA           D   COPY public.finanzas (id, tipo, concepto, monto, fecha) FROM stdin;
    public          postgres    false    244   ��       X          0    25220    mesas 
   TABLE DATA           L   COPY public.mesas (id, numero, estado_id, ubicacion, capacidad) FROM stdin;
    public          postgres    false    228   ��       \          0    25274 	   productos 
   TABLE DATA           �   COPY public.productos (id, nombre, descripcion, precio, categoria, estado_id, creado_en, actualizado_en, imagen_url) FROM stdin;
    public          postgres    false    232   ��       f          0    33459    recetas 
   TABLE DATA           O   COPY public.recetas (id, instrucciones, ingredientes, producto_id) FROM stdin;
    public          postgres    false    242   ��       Z          0    25232    reservas 
   TABLE DATA           U   COPY public.reservas (id, usuario_id, mesa_id, fecha_reserva, estado_id) FROM stdin;
    public          postgres    false    230   ��       V          0    16981    respuestas_soporte 
   TABLE DATA           {   COPY public.respuestas_soporte (id, soporte_id, administrador_id, mensaje_respuesta, respondido_en, estado_id) FROM stdin;
    public          postgres    false    226   d�       L          0    16914    roles 
   TABLE DATA           +   COPY public.roles (id, nombre) FROM stdin;
    public          postgres    false    216   ��       R          0    16951    soporte 
   TABLE DATA           E   COPY public.soporte (id, usuario_id, mensaje, creado_en) FROM stdin;
    public          postgres    false    222   M�       P          0    16935    usuario_roles 
   TABLE DATA           ?   COPY public.usuario_roles (id, usuario_id, rol_id) FROM stdin;
    public          postgres    false    220   I�       N          0    16922    usuarios 
   TABLE DATA           q   COPY public.usuarios (id, nombre, email, "contraseña", creado_en, actualizado_en, activo, apellido) FROM stdin;
    public          postgres    false    218   ��       {           0    0    bodega_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.bodega_id_seq', 6, true);
          public          postgres    false    245            |           0    0    carrito_compras_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.carrito_compras_id_seq', 697, true);
          public          postgres    false    233            }           0    0    comandas_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.comandas_id_seq', 297, true);
          public          postgres    false    239            ~           0    0    compras_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.compras_id_seq', 268, true);
          public          postgres    false    235                       0    0    compras_productos_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.compras_productos_id_seq', 527, true);
          public          postgres    false    237            �           0    0    estados_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.estados_id_seq', 10, true);
          public          postgres    false    223            �           0    0    finanzas_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.finanzas_id_seq', 29, true);
          public          postgres    false    243            �           0    0    mesas_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.mesas_id_seq', 71, true);
          public          postgres    false    227            �           0    0    productos_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.productos_id_seq', 97, true);
          public          postgres    false    231            �           0    0    recetas_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.recetas_id_seq', 22, true);
          public          postgres    false    241            �           0    0    reservas_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.reservas_id_seq', 249, true);
          public          postgres    false    229            �           0    0    respuestas_soporte_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.respuestas_soporte_id_seq', 99, true);
          public          postgres    false    225            �           0    0    roles_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.roles_id_seq', 5, true);
          public          postgres    false    215            �           0    0    soporte_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.soporte_id_seq', 99, true);
          public          postgres    false    221            �           0    0    usuario_roles_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.usuario_roles_id_seq', 585, true);
          public          postgres    false    219            �           0    0    usuarios_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.usuarios_id_seq', 517, true);
          public          postgres    false    217            �           2606    33489    bodega bodega_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.bodega
    ADD CONSTRAINT bodega_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.bodega DROP CONSTRAINT bodega_pkey;
       public            postgres    false    246            �           2606    25308 $   carrito_compras carrito_compras_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.carrito_compras
    ADD CONSTRAINT carrito_compras_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.carrito_compras DROP CONSTRAINT carrito_compras_pkey;
       public            postgres    false    234            �           2606    25405    comandas comandas_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT comandas_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comandas DROP CONSTRAINT comandas_pkey;
       public            postgres    false    240            �           2606    25370    compras compras_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.compras DROP CONSTRAINT compras_pkey;
       public            postgres    false    236            �           2606    25387 (   compras_productos compras_productos_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.compras_productos
    ADD CONSTRAINT compras_productos_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.compras_productos DROP CONSTRAINT compras_productos_pkey;
       public            postgres    false    238            �           2606    16972    estados estados_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.estados
    ADD CONSTRAINT estados_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.estados DROP CONSTRAINT estados_pkey;
       public            postgres    false    224            �           2606    33481    finanzas finanzas_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.finanzas
    ADD CONSTRAINT finanzas_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.finanzas DROP CONSTRAINT finanzas_pkey;
       public            postgres    false    244            �           2606    25225    mesas mesas_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.mesas
    ADD CONSTRAINT mesas_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.mesas DROP CONSTRAINT mesas_pkey;
       public            postgres    false    228            �           2606    25285    productos productos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.productos DROP CONSTRAINT productos_pkey;
       public            postgres    false    232            �           2606    33466    recetas recetas_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.recetas
    ADD CONSTRAINT recetas_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.recetas DROP CONSTRAINT recetas_pkey;
       public            postgres    false    242            �           2606    25238    reservas reservas_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.reservas DROP CONSTRAINT reservas_pkey;
       public            postgres    false    230            �           2606    16988 *   respuestas_soporte respuestas_soporte_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.respuestas_soporte
    ADD CONSTRAINT respuestas_soporte_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.respuestas_soporte DROP CONSTRAINT respuestas_soporte_pkey;
       public            postgres    false    226            �           2606    16920    roles roles_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    216            �           2606    16959    soporte soporte_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.soporte
    ADD CONSTRAINT soporte_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.soporte DROP CONSTRAINT soporte_pkey;
       public            postgres    false    222            �           2606    25326 '   carrito_compras unique_usuario_producto 
   CONSTRAINT     u   ALTER TABLE ONLY public.carrito_compras
    ADD CONSTRAINT unique_usuario_producto UNIQUE (usuario_id, producto_id);
 Q   ALTER TABLE ONLY public.carrito_compras DROP CONSTRAINT unique_usuario_producto;
       public            postgres    false    234    234            �           2606    16939     usuario_roles usuario_roles_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.usuario_roles DROP CONSTRAINT usuario_roles_pkey;
       public            postgres    false    220            �           2606    16933    usuarios usuarios_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_email_key;
       public            postgres    false    218            �           2606    16931    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public            postgres    false    218            �           2606    33490 *   bodega bodega_transaccion_finanzas_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bodega
    ADD CONSTRAINT bodega_transaccion_finanzas_id_fkey FOREIGN KEY (transaccion_finanzas_id) REFERENCES public.finanzas(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.bodega DROP CONSTRAINT bodega_transaccion_finanzas_id_fkey;
       public          postgres    false    246    244    4770            �           2606    25319 .   carrito_compras carrito_compras_estado_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.carrito_compras
    ADD CONSTRAINT carrito_compras_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.estados(id);
 X   ALTER TABLE ONLY public.carrito_compras DROP CONSTRAINT carrito_compras_estado_id_fkey;
       public          postgres    false    224    234    4748            �           2606    25314 0   carrito_compras carrito_compras_producto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.carrito_compras
    ADD CONSTRAINT carrito_compras_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.carrito_compras DROP CONSTRAINT carrito_compras_producto_id_fkey;
       public          postgres    false    232    4756    234            �           2606    25309 /   carrito_compras carrito_compras_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.carrito_compras
    ADD CONSTRAINT carrito_compras_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.carrito_compras DROP CONSTRAINT carrito_compras_usuario_id_fkey;
       public          postgres    false    218    4742    234            �           2606    25406     comandas comandas_compra_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT comandas_compra_id_fkey FOREIGN KEY (compra_id) REFERENCES public.compras(id);
 J   ALTER TABLE ONLY public.comandas DROP CONSTRAINT comandas_compra_id_fkey;
       public          postgres    false    236    240    4762            �           2606    25411 "   comandas comandas_producto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT comandas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);
 L   ALTER TABLE ONLY public.comandas DROP CONSTRAINT comandas_producto_id_fkey;
       public          postgres    false    4756    232    240            �           2606    25376    compras compras_mesa_id_fkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_mesa_id_fkey FOREIGN KEY (mesa_id) REFERENCES public.mesas(id);
 F   ALTER TABLE ONLY public.compras DROP CONSTRAINT compras_mesa_id_fkey;
       public          postgres    false    228    4752    236            �           2606    25388 2   compras_productos compras_productos_compra_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.compras_productos
    ADD CONSTRAINT compras_productos_compra_id_fkey FOREIGN KEY (compra_id) REFERENCES public.compras(id);
 \   ALTER TABLE ONLY public.compras_productos DROP CONSTRAINT compras_productos_compra_id_fkey;
       public          postgres    false    236    238    4762            �           2606    25393 4   compras_productos compras_productos_producto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.compras_productos
    ADD CONSTRAINT compras_productos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);
 ^   ALTER TABLE ONLY public.compras_productos DROP CONSTRAINT compras_productos_producto_id_fkey;
       public          postgres    false    238    232    4756            �           2606    25371    compras compras_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);
 I   ALTER TABLE ONLY public.compras DROP CONSTRAINT compras_usuario_id_fkey;
       public          postgres    false    218    236    4742            �           2606    33495    compras fk_transaccion_finanzas    FK CONSTRAINT     �   ALTER TABLE ONLY public.compras
    ADD CONSTRAINT fk_transaccion_finanzas FOREIGN KEY (transaccion_finanzas_id) REFERENCES public.finanzas(id) ON DELETE SET NULL;
 I   ALTER TABLE ONLY public.compras DROP CONSTRAINT fk_transaccion_finanzas;
       public          postgres    false    244    236    4770            �           2606    25226    mesas mesas_estado_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.mesas
    ADD CONSTRAINT mesas_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.estados(id) ON DELETE SET NULL;
 D   ALTER TABLE ONLY public.mesas DROP CONSTRAINT mesas_estado_id_fkey;
       public          postgres    false    224    228    4748            �           2606    25286 "   productos productos_estado_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.estados(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.productos DROP CONSTRAINT productos_estado_id_fkey;
       public          postgres    false    4748    232    224            �           2606    33467     recetas recetas_producto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.recetas
    ADD CONSTRAINT recetas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.recetas DROP CONSTRAINT recetas_producto_id_fkey;
       public          postgres    false    242    232    4756            �           2606    25249     reservas reservas_estado_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.estados(id) ON DELETE SET NULL;
 J   ALTER TABLE ONLY public.reservas DROP CONSTRAINT reservas_estado_id_fkey;
       public          postgres    false    4748    230    224            �           2606    25244    reservas reservas_mesa_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_mesa_id_fkey FOREIGN KEY (mesa_id) REFERENCES public.mesas(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.reservas DROP CONSTRAINT reservas_mesa_id_fkey;
       public          postgres    false    4752    230    228            �           2606    25239 !   reservas reservas_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.reservas DROP CONSTRAINT reservas_usuario_id_fkey;
       public          postgres    false    218    230    4742            �           2606    16994 ;   respuestas_soporte respuestas_soporte_administrador_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.respuestas_soporte
    ADD CONSTRAINT respuestas_soporte_administrador_id_fkey FOREIGN KEY (administrador_id) REFERENCES public.usuarios(id);
 e   ALTER TABLE ONLY public.respuestas_soporte DROP CONSTRAINT respuestas_soporte_administrador_id_fkey;
       public          postgres    false    226    218    4742            �           2606    16999 4   respuestas_soporte respuestas_soporte_estado_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.respuestas_soporte
    ADD CONSTRAINT respuestas_soporte_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.estados(id);
 ^   ALTER TABLE ONLY public.respuestas_soporte DROP CONSTRAINT respuestas_soporte_estado_id_fkey;
       public          postgres    false    226    224    4748            �           2606    16989 5   respuestas_soporte respuestas_soporte_soporte_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.respuestas_soporte
    ADD CONSTRAINT respuestas_soporte_soporte_id_fkey FOREIGN KEY (soporte_id) REFERENCES public.soporte(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.respuestas_soporte DROP CONSTRAINT respuestas_soporte_soporte_id_fkey;
       public          postgres    false    4746    222    226            �           2606    17152    soporte soporte_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.soporte
    ADD CONSTRAINT soporte_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.soporte DROP CONSTRAINT soporte_usuario_id_fkey;
       public          postgres    false    218    4742    222            �           2606    16945 '   usuario_roles usuario_roles_rol_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);
 Q   ALTER TABLE ONLY public.usuario_roles DROP CONSTRAINT usuario_roles_rol_id_fkey;
       public          postgres    false    4738    216    220            �           2606    17147 +   usuario_roles usuario_roles_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.usuario_roles DROP CONSTRAINT usuario_roles_usuario_id_fkey;
       public          postgres    false    220    4742    218            j   �   x�m�1n�0Eg��@���H[���BXja�@�О>6:x��?p���'����Z}t]*d D��,��XJ�C6|P�SZ�-w��B��R�Dۆ�ǟ��0]`A���C��6.󤿶6;��lj�>.?:A8�K�P8:��HL���U������>~��V=o@�O�7�JJY���;c��\JC      ^   z   x�}���0DѳXE0��&ɵ��:B�9��?�0��F4䤋]�%��~�[W��D� ��X���%�؄iA�e��N��������xI�̍�,�����z�X�8�:NƿЗ��`�J�      d   �  x����q9��g�P7E��q8�8�AZW�!(O�����.Q;�����׿�\X�!���W�K�2:Y5�u���e�%vv��ꇸ�r�6�v������Q̈܏ֳ� �b=ku"��L�4�"����`�C�j|h]`��vEڧ7�.�ۀ�^�}�U��^���4`���i��ל���Ev��8��p�j.��뀓�3�'�^�m����:tt�gi��>��F�����i�k�f0��m��2��3Xgz��f��.���m���Q���e�"4�tH����s��6`Ϻ{���תK`-3������V������j�E�py�{\w�:E��.���ɦ�!�׭[�R����K��6�]=?�:��3�g�M!�a�č�b�?�Qwtw\]��i�G}¯҈B��$=�s.�ᒂ1QT�	�7��<�D�W��,��Z]�}�J�t;݊Pl�70FC���[=`%3s��|h���<a*�`�7Q�L��n�A�RЩՂ4L&�F^`p����u٤g�1&��:\C
���!�i,0M������b���\ZN�Z뇩�m���4�by����3+3.�au�+oX����U2E�R�O��N�~
8o��������#��Rs��Ԅ֓jƅ1D6Q�ѥBWig���}��8��'2��2#�b�2X'�j�
�����|{wng������=�BY��D�6"'^'���6F�K�9o�#2ʽnF��jX�"0�,^���,3r�֔.��a�9M��hh1G���wB�6QX�x�Y���+��}��w���ȿ+�G85�09���E���(`�&�G�8�d��/�԰gv�8��gN`�y��"��.��׍�����/D��F���	����6���p���>��RX��<W���ýH�i(���8�(�Ȕ|I��%�Ss��2̞"�>�1�Ր�0{��m��]�W=�0�mpp��ppKg���V�	C���%�x�Y�0�Y�O�"�
�4�L�K�;�z���;�C0\"\*w�j�ma�8ө^��=�LxcV�����6፳}�u©�|��F�mo�0)�uU�;����?���n���m}ʾ���^&�_�4�oc���ߌ*
�Wu;�%�4�k����V�,�9P�#w�%����O�a��n�ƚ�?��g��Ch+a-��קD�K?K�w���%U�YD�p�y(qٱ?�}y���L�r<�����;,ޕ���Y�a�6�9f`|>o��u�53�+lN��
�'���3rf��0�X9�'�QG�CAEj���U?�n���!X���ǣm��\<	_\NW�(#�,�%I��++�`Pi�����j������>����x�ǁ���:���*�(�G������mvw��ݳ�p���}��{����P�$u����z�8q�+�WzӄW�`��4d��n��:#�&��F�r�"��-&�NC5Z%j�{lJ8`�]J|�G/��l��Ʈ���DqL�h�XHq�;�����K7`���0OxSuX�{�����R[u��0���b/���C�ξZap]|���VX&�}���:�XGJی�.�:O�����ߖ=a�0=��]�)�Gc�����+Ơ���d�@[I�F�b�� �Bc��`4��S0)�2z�v� c�����Z�m:�k�����І�lPъ��Z�<B>�:�M>`���p�4d��-LAw(A�u��"��>�M�>�6�����_����[��      `   �  x����m�0���*���/�E\鿎ٖ|����|!9R��E#�jNT�]���0�z��N+i	1S]���_1(&��t�
LE����Ek+yq7OX���8z4`�"U���#-��N�_�+g�j%o̎�#���zP9S䷂��HDk�����W�he+����:�tI�O�^«�լh�6rD�{����2)"D��7=B'%�^�,b�#X��I�9������E�"&���g��s�J���IϘJE�HG�<0Y`�w:����b�e�t�?�&�?M}��wmS$�R���Vk��"���nc��	}n(�����u����>�%!�P_�/yGA�M��5�i1����ŘiYM`c5ɥ����)^;���U���6��Ρ~�
6H[=
�E|����h[4�Ԗ�Fw��u�����7�u�Ef��c�c��W��[��Ԅ��2�7z``K�O'a�Y� >��$]a�)j��tJ�)��ɵѶ�
��Cw�\r�˺B�1�+6K�]���g(β�H	=�����vUq�o��C!>ӎ�`-�3�/���������8�g��5G`�
r�����h�/��-C��p���:���>g�#�]�hz�C*A��|�l�w�- 3L�3��?<Um�n��3֘���K��u���Ħ���*�����M��;8����a2�౩��e}�{�������>�-�:u{�NqJ4�:1�Iʧ�/�¬>���Y�Cډ�h��W�>z���Z�;�G^3�z=�G�D�%�g���Q��@a�����0�]�SI�GѤ���n�'�T-��u�F�K>Es|�1=�F�(I�%܉M�8�_��]"H��)4`��ƴ&�5��
��$�?Of</�<�i�bh ������=e���<��l��w�p*�yߦ?¢x�~�l�M��牤_K��6���n�0�w����L���      b   m  x�u�ە1D�{���H�8�8LAK�ㅯ�5J�����lz�Y�گ���O�mp<��ւ�����1�����Z�۱����Xӵfû����j,��M�a~)_h��^�=�3��~\�k�O�������x!0y}�q=Z��7�׋)l%�zp�+։�_�=lӌq�\8րH�_�|�B�� ��r:��yH�Rz�r<!�	���K�����0�c�u��i�W0��b���sׁЩ�J�;w�Z[47�ym��\�9E�'�3ݘ7>?h��B�0=u����@vX�z`INLr�B�p-&Ž#�w�r�5N�SVt�
u��M�ظ��a����D2�p��g.8ĸ ,
S���͎��'z�Vbn	���W�u����K��a5�6��G���ˡ��I8�vX�#qY9J9�#GҠU�l{��~�A+����+�6�3G��*���~}���ip�ǯ�Ҽ&�(`6a�8 ڌ_K���aUU�h�/|Z�Ŭ�p��K�0}�F���t����Q�]�+p^�BP��:�!�̻P��Q3;�J���*���V1݅�a�1ۑ�\f�M�]t���c~��p;�N���p�nw'N 
���9�q(}qw�n8�%l�릓M�J�>�ۨ��и��E�t(U�m"�q��PئCE�a�1���瞪���8�;�{c����w���}�[;��]l���W����h,)�`厱��{��1��� ��˝P������ί���G،��M�������Lݢ3s��a�	(E{��d�S��WuW3�>`�����l�r\�tOe�N
\�;��Ry�쁫��q>s��V���U`�p��LhV?8s;�ζ�e�_Q{��n�Ս���]�<�Y� �g�j\�U�S:7�z=��+�z���Y��{6_l!���������?�� ;�\n��ذ�*K��u�6BنR�M#u�����U���Z׆��o+b]̣��I��'���Q^���ϣ��պ�h�͟G�G���a6��~��V��j�?0��;�y^��;�����Z	j��d"�钭���P����1��_4%�5��Pi8L�?��0}>�VX��+��M��(&�UB̎��a��l'?�5eqXE�금z8L���Y�����|���}�      T   r   x�E���0������#�v��b�"�j�|=��vw�ux�y�B{Lָ��H=^���i�M�M?A�P��{�W�JG\\֍�+��P���V�Z�c������~�}&�      h   �  x����n�0���S�*�S�t�z�i�]��3�q`��r����r�!��H��S���~���k�����%N��U�H�px��c�P��I����8�a���6jKbt��AM�n3��r�F�{ݳV�5�:ml�ۙ�<����OS~�[����C`6�����t���z�r�u���uWrd�����q���&��J	[�,h�|������/�P�+����л�1H[7|�&_�s�r)QI�wJ�ʖ�����"x��@i"�J'��?��Npet��Z�c!�{��K�v�}���c��><����%5�ޒ\bF'1"��-�E;�!� �oI��� ��!�%9&N}dC�%�Ur)�\D	ص"��!ނ�*��B.r	I�0�3�!ْ�:9Tcf\��!"C��W���E導U���P����h�f��8:hIQU����6,��i�g�X.�K���\��L)�H�YD�\'��1����7      X   \   x�]�1� D�z�08��w���фXx|!1�о���"<����qxjF����8ʢ�/�2pC�{�;��D	�oC�5Ð�������)r      \      x��ZM��8�=�@��O�ͮ���������Fl@��5���Gm��M������Zl_�D��Ry#�,�2�2��4���;W�ʪrm����S�j��k��e^�[Wm�N��4e�6嶌]^ov���߬�xG���]Y�:��f,a,z����H0��/x3�j�d��f�L��Z
�T&QFjm���w[��w]�)���Lr#T��bl��<5��4�moR2z�em��*�u�ѵ.�V�MQa��ۜ�f[ě�*��*΋US�⻾x��u��W�7[�]�'��m��7<W=�ٖy}0Y��&���K%�y�^�Y²�01k��J�T-�✙���~���d��?��LΛ��,�]�����5M�MÇ�)�r#wEsS䝋w�q��8<G.���$��yf)mb�i*=74g����J��faC��u]S�y�F�'[H�)��O�S������Oh{�Pĭ���U�9���h�W�C�U���;�u������� �� TVK#�͚/ -\1�4KM�?=��]D����� _��`[��˧n���`��;f���|��8���o�\�_Q@�Lf��Ьi�����MΌ�eG�]sM�-h��?��8z�ր�~�����͊���(�l�rU��<~�#��Ĥ\~nh6#1aS��S�V��x(�;����Ch�z3\Ȝ���a���~��bW�� 7��m���!M%���J�.OX�Z�̨�ЬQ�p�����2��(]��`���ϲ�=X�oQ^��xz>�`����v�{�i��K��%�H��F�?74k� �=6ˤ�L���,��V�!u�~u���KQy�Ҙ1�1�Ӵ{�����y�L��R0	��*�Bp����Ce�df�e)�f`o�����-�k�����㢷�
�ߺ���k��CHrO��"Ax��ҥ^J�d�iy
�����k)U&%��< �
��u�e,�9�s���kub@=.�������V�-e�X8��sC��W:�x^ҩ�X (�E��][��ӛ���=�2m�q�Lznhv�	&�H���ECn��z��	0 ���ֻMn��+�
V`	�i�KC&�B[��Y�a ������P���A��N���"a��Xݳ�s 1;�p���邤����p;������/zd�%F0ɞ�d:4k�1�U\�f,�ހ�E����������9��$��a ��[�{}�_Z�Y*�T�f����U�\����� rªy�u��no��'�=L ��>T	&���b���jF�Bj+���;�]���dz���B�ʐCR}(�%����.�+��m�s�!M�y�����	��k�'���/CFS%����S�LGf�QL�L.����e�9.4�u]�5Fon{wD��]M�
9�w~���`O4�ȧ!��%	e�3Uc

��,4�"M���J��M��Kο�������Q �Ռ��wC�OJ`_R���ڇ<O��[�	�
��I��;o�Q��j��K���МY�0��ƤFaWB�L3�c_ �P�T3)������G��=�f�l�~�K���Z�̔�Ь)�2�BB�� �*��5��������E����d�J�LL�%(z����"^o
�KDY�4��5Es�E�G�wR�C���C��X��O5u\�c/:_�U~�%\��˾CAֺMQ���4��
�DW�����AzH�gFfML5�|���. E�/@��f���m]�d{F�y�@x$�ch�۲Wv��T�x�:\�-}k�R���:ޡ�s��Bh�Aۜ��A�>�@~<�χ�M,���@;�ʦ\g��F��`�����z����>12|�޾���ۢy 	��.UW�?��P/�*6����+�ۂp@�к�:4��=#�'�A�W�u� �(p �ߜ����M�S\�b���"��	�N�\��q��z-7V)e�ZJԵtt�n�֯[pȜy$2H�� ��ڰ�=*�Щ�W�/�Y5d!?��d!O�E��"�8o���-^�U>y�z������,����(���!ꝦuT�J��!�2#3�Ȩ�$��3~p�m��;����)�_Q����T�o:b�$��>@@pO���?��.u��gA���K~�:E��2*���<��R),v�-�Qm Y��T���mϻ-VH�;�n���M�4C S��=3���"��@I{�Y�-�qWq�����̶j(ݕ�c�=����#����kB(��(�	�� ��
�h5l�c)9��8��J��jl7�Gb�j>��u{Dѹ��O��fu2{윦DԠG��Q\ބ_l�I����
����5�
k�5�2�|`1�[��>��th�_`A+��A��3�B7���������_���,⿹��E�7�\��nUTq�i��@	�m�n��N�<����x[�'����H7԰��!���k����AU�]��!��|��|����뻺z��P>��?�?�`�άM�K�QW����(��WTD�C���0�g���ҭ�\gG���!��W?uE�>@�0l�B��m��V鮩o�;~>��m݅h�e�[=���HP8̏��Xِ|nù�EbK�PZ�w�X��3��L�:M/�I2��O{�����J�L�	��42�Q��(����@8e�jd�B؟uu��K�����-ܶ�F��==]��S�,�֞��|d�|���)BJ?0U��s�!�_���[�������s��B�s����{(��bx��ԯ@,hi2snhV2�<An_(�8=Д��]�#�a�THe�y2��
'�c�}aۆ'�"	՟�Ai���y<N�Q\��}�z�5�^L`TŹ�Y˅F����~s:	��_�f~���֏�㸆����u~d1��G/�)�{�%U����h�z�.��؆��mO]�u���(
�EAe�U�?�cm� _wu� WisA�1��A�鹡YVQ��3	զIO{6Z:p�{���åCf{�l8)8�a�)"��X!� yv�:���R�r)��Y'��
�����B�p�ad������c%}	۵�׈��GJ��:(l_ ��u�/�����s�3�Y�$��DY���ڇ�G�x�Uʪ��Ө��P<��*d��z_�c��+w�H��UH�Tr��#1J%�U\δ'=��w�
#tQ;���c�j��) �0��1|���b�}+���3�C�ΐ�*����:�������]U��������ߐ�1��j�"�����/�!A:v�E��u��F[v�.>�=��g J(�[̥��o��@$�	�X}nh�7t���h�tƇ<��O5��B�����T�>TiajM�S\{܆?�ӟpݡT;��=���T �R���IiJ<���g?OҤF.$�f8���U�_�Tt���1�1��C����5w��(h�<RC?}_�[�No�@JK������j�LLcg�� �h:��_�&����Jԟ���o����]���t������*G-�R���d�J�0���\~�:�p�������'I�Ϥ�yR�|�GID�<�	�j���y	��ѧ����50+��v�s�	�i��F��0��j�6�Z�A�rw�
�Q�M���'xF�0@���8{�2�xF�N��hh��]g�/R�2�fc
H��k1mXP&�4��F���'�L��5-II?.���i[�7$���ԅ߆�I ��K1�h�bJ�f���&�Q6�v7e�R|! *��By�dy��响#a�5z=}����:�>�c[j=��5}���큣�:���;����*����Hq:��F���E�%A���g)���.l�lZR#���;ƨ���yq돱@*�1�C�`��W}�y�E�:������Ex\���/h���};#twf�n�y�ӟy�B�/���ׇ�s�+9�Ғ�yh�曄�&j,;#C3F�ea����Yh�@���z[�Ԥc|8��r*�H�`���kE��#��(l�Q$���B۾����4_?j*�����Z�l)�$���>Q"��;t\���:�
u��[j��w�P� �   �Q�d���2��MO�[Gw��X�f[��7M}o�jӧ�x����O��w���}�Web�p�m�i�e�$:�I@2�K�\&P��rl�[}-7����@���������|����o��V���|�ž�q��n�w�0�"o�5�y]�QH����dH�i�R] �鼀�&���u85����O?��j��I      f     x�]�1n�0Eg�<�a�v��s��v�%�Q ��h�O_�I[���?���|m��gJ����kx�I*|�����H+T��a
�B�c"xiL�uI��A�+������"�*�1k�1yW�����4'8 ���+�a��1�����`WX�4P��ݧ���B
}k��o!��'��p�t����q���7M�ѝO#p�W[� ��i�p�<P��k���p�tb̘6b:K
T��H~��G)�K��&�Qdb'�+zV�Lu�T����:۳آ��?�gm����      Z   Y   x�U���@�7T�|���@-�)�� [�-�C��7x9�{������"G�F
.6b1��������|.�5n�Ң��9��}�      V   �   x�M�Q
� ��?������%v���Շ���I￴�P�P�51�`F�"���T*LF̲t~U`Ґ�����\���קih�sX�l���`۪���0Gk��y��|�s���"��E�9�1L%�����L7"���;z      L   B   x�3�LL����,.)JL�/�2�L��K̫J,�2�L�Or�L8��SR��L9�s2S�JR�b���� \z�      R   �   x���[n� E�al �XE��e���]��ї���|�;��0�<{Y�9�TE��G�ty˫s�KL��Bs8
�飤��ӱ��I0���Y ��u������ׇ��i�
��{Z���4�r f�y��9�K-��KmQlm��T���V��aoj�:�4^�A������(h�+����bA��Ug=1[s�؊�{�=���&1�4}{ھ-t9�E�_%��t�}/      P   _   x�%��� г�'HPw��s4��o����ᖘcե�RԖ�:j;���ly�re���b����{�D����n$f��\�%q%!�^���>f�PR�      N   N  x�m�Ks�0���+\tۘLVj+��
��M� x!�G����t��2�.����#����Ba-J�r#Tk�	��`�iwX�!xw\��9��7s��L]{���f*&;�5h[���M��f)b�?7!�0��=B����X�h�{��D�c�!����{!�H�q^F���G�2@�~�d�)G�r��qBM�������)�
��1���bM�,@�l.C���X1u�	`�a�uD�A9��A����iq.UK�т�+���h�<��BF�+�~P��>�&X��y�{v?��Ɍ���l����;��<�fvRn�t�-BV��ʑ0kސ�:D�oa��}A�b�{ǔ�t����������Y���[��S/E�H���)�ou��^,v�꤇�ʔ�����X��cN����QUo��d���f�p�	��s�k�r��Q>��P�A�j46����n:�1���:���OP������x�Z�	 �e2�+d܀ ��Z�
�F����B	�K���b��O�޳�|��y���Q�P2K�G���0�31��	�%l�:�z�Q�����	��7y�����Z����	Q     