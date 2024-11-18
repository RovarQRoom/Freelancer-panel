export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			Category: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					icon: string | null;
					id: number;
					image: string;
					title: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					icon?: string | null;
					id?: number;
					image: string;
					title: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					icon?: string | null;
					id?: number;
					image?: string;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Category_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Conversation: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					is_group: boolean | null;
					name: string | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					is_group?: boolean | null;
					name?: string | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					is_group?: boolean | null;
					name?: string | null;
				};
				Relationships: [];
			};
			ConversationParticipant: {
				Row: {
					conversation: number | null;
					created_at: string;
					deleted_at: string | null;
					id: number;
					user: number | null;
				};
				Insert: {
					conversation?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					user?: number | null;
				};
				Update: {
					conversation?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					user?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'ConversationParticipant_conversation_fkey';
						columns: ['conversation'];
						isOneToOne: false;
						referencedRelation: 'Conversation';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'ConversationParticipant_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			Language: {
				Row: {
					ar: string | null;
					ckb: string | null;
					created_at: string;
					deleted_at: string | null;
					en: string;
					id: number;
				};
				Insert: {
					ar?: string | null;
					ckb?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					en: string;
					id?: number;
				};
				Update: {
					ar?: string | null;
					ckb?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					en?: string;
					id?: number;
				};
				Relationships: [];
			};
			Message: {
				Row: {
					content: string;
					conversation: number | null;
					created_at: string;
					deleted_at: string | null;
					id: number;
					is_read: boolean | null;
					sender: number | null;
				};
				Insert: {
					content: string;
					conversation?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					is_read?: boolean | null;
					sender?: number | null;
				};
				Update: {
					content?: string;
					conversation?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					is_read?: boolean | null;
					sender?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Message_conversation_fkey';
						columns: ['conversation'];
						isOneToOne: false;
						referencedRelation: 'Conversation';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Message_sender_fkey';
						columns: ['sender'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			Notification: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					icon: string | null;
					id: number;
					image: string | null;
					message: string | null;
					title: string;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					icon?: string | null;
					id?: number;
					image?: string | null;
					message?: string | null;
					title: string;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					icon?: string | null;
					id?: number;
					image?: string | null;
					message?: string | null;
					title?: string;
				};
				Relationships: [];
			};
			NotificationUser: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					notification: number | null;
					seen: boolean | null;
					user: number | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					notification?: number | null;
					seen?: boolean | null;
					user?: number | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					notification?: number | null;
					seen?: boolean | null;
					user?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'UserNotification_notification_fkey';
						columns: ['notification'];
						isOneToOne: false;
						referencedRelation: 'Notification';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'UserNotification_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			Policy: {
				Row: {
					created_at: string;
					id: number;
					name: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			Rating: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					rate: number;
					review: string | null;
					service: number;
					user: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					rate?: number;
					review?: string | null;
					service: number;
					user: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					rate?: number;
					review?: string | null;
					service?: number;
					user?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Rating_service_fkey';
						columns: ['service'];
						isOneToOne: false;
						referencedRelation: 'Service';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Rating_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			Role: {
				Row: {
					created_at: string;
					id: number;
					name: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			RolePolicy: {
				Row: {
					created_at: string;
					id: number;
					policy: number | null;
					role: number | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					policy?: number | null;
					role?: number | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					policy?: number | null;
					role?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'rolepolicy_policy_fkey';
						columns: ['policy'];
						isOneToOne: false;
						referencedRelation: 'Policy';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'rolepolicy_role_fkey';
						columns: ['role'];
						isOneToOne: false;
						referencedRelation: 'Role';
						referencedColumns: ['id'];
					}
				];
			};
			Service: {
				Row: {
					created_at: string;
					created_by: number | null;
					deleted_at: string | null;
					demo: string | null;
					description: number | null;
					id: number;
					media: number | null;
					price: number;
					supervised_by: number | null;
					supports: string[] | null;
					tags: string[] | null;
					title: number;
				};
				Insert: {
					created_at?: string;
					created_by?: number | null;
					deleted_at?: string | null;
					demo?: string | null;
					description?: number | null;
					id?: number;
					media?: number | null;
					price?: number;
					supervised_by?: number | null;
					supports?: string[] | null;
					tags?: string[] | null;
					title: number;
				};
				Update: {
					created_at?: string;
					created_by?: number | null;
					deleted_at?: string | null;
					demo?: string | null;
					description?: number | null;
					id?: number;
					media?: number | null;
					price?: number;
					supervised_by?: number | null;
					supports?: string[] | null;
					tags?: string[] | null;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Service_created_by_fkey';
						columns: ['created_by'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Service_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Service_media_fkey';
						columns: ['media'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Service_supervised_by_fkey';
						columns: ['supervised_by'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Service_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Subcategory: {
				Row: {
					category: number | null;
					created_at: string;
					deleted_at: string | null;
					description: number | null;
					id: number;
					title: number;
				};
				Insert: {
					category?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					title: number;
				};
				Update: {
					category?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Subcategory_category_fkey';
						columns: ['category'];
						isOneToOne: false;
						referencedRelation: 'Category';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Subcategory_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Subcategory_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			TypingStatus: {
				Row: {
					conservation: number | null;
					created_at: string;
					id: number;
					is_typing: boolean | null;
					updated_at: string | null;
					user: number | null;
				};
				Insert: {
					conservation?: number | null;
					created_at?: string;
					id?: number;
					is_typing?: boolean | null;
					updated_at?: string | null;
					user?: number | null;
				};
				Update: {
					conservation?: number | null;
					created_at?: string;
					id?: number;
					is_typing?: boolean | null;
					updated_at?: string | null;
					user?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'TypingStatus_conservation_fkey';
						columns: ['conservation'];
						isOneToOne: false;
						referencedRelation: 'Conversation';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'TypingStatus_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			User: {
				Row: {
					auth: string | null;
					created_at: string;
					deleted_at: string | null;
					email: string;
					id: number;
					image: string | null;
					name: string | null;
					phone: string;
					role: number | null;
				};
				Insert: {
					auth?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					email: string;
					id?: number;
					image?: string | null;
					name?: string | null;
					phone: string;
					role?: number | null;
				};
				Update: {
					auth?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string;
					id?: number;
					image?: string | null;
					name?: string | null;
					phone?: string;
					role?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'User_role_fkey';
						columns: ['role'];
						isOneToOne: false;
						referencedRelation: 'Role';
						referencedColumns: ['id'];
					}
				];
			};
			UserService: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					service: number;
					user: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					service: number;
					user: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					service?: number;
					user?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'UserService_service_fkey';
						columns: ['service'];
						isOneToOne: false;
						referencedRelation: 'Service';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'UserService_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			compare_user_password: {
				Args: {
					p_user_id: string;
					p_current_password: string;
				};
				Returns: boolean;
			};
			verify_user_password: {
				Args: {
					password: string;
				};
				Returns: boolean;
			};
		};
		Enums: {
			'Languages ': 'EN' | 'AR' | 'CKB';
			Tags:
				| 'WEB_DEVELOPMENT'
				| 'GRAPHIC_DESIGN'
				| 'DIGITAL_MARKETING'
				| 'CONTENT_WRITING'
				| 'DATA_ENTRY'
				| 'MOBILE_APP_DEVELOPMENT'
				| 'SEO'
				| 'VIDEO_EDITING'
				| 'TRANSLATION'
				| 'CONSULTING'
				| 'SOCIAL_MEDIA_MANAGEMENT'
				| 'UI_UX_DESIGN'
				| 'E_COMMERCE_DEVELOPMENT'
				| 'SOFTWARE_DEVELOPMENT'
				| 'VIRTUAL_ASSISTANT'
				| 'PHOTOGRAPHY'
				| 'COPYWRITING'
				| 'BRANDING'
				| 'EMAIL_MARKETING'
				| 'MARKET_RESEARCH'
				| 'PROJECT_MANAGEMENT'
				| 'VOICE_OVER'
				| 'ANIMATION'
				| 'ILLUSTRATION'
				| 'WEB_HOSTING'
				| 'CYBERSECURITY'
				| 'BLOCKCHAIN_DEVELOPMENT'
				| 'GAME_DEVELOPMENT'
				| 'APP_TESTING'
				| 'TECHNICAL_SUPPORT'
				| 'CONTENT_STRATEGY'
				| 'PUBLIC_RELATIONS'
				| 'PODCAST_EDITING'
				| 'AFFILIATE_MARKETING'
				| 'LEAD_GENERATION'
				| 'DATA_ANALYSIS'
				| 'BUSINESS_CONSULTING'
				| 'FINANCIAL_CONSULTING'
				| 'LEGAL_CONSULTING'
				| 'HR_CONSULTING'
				| 'PRODUCT_DESIGN'
				| 'MODELING_3D'
				| 'INTERIOR_DESIGN'
				| 'FASHION_DESIGN'
				| 'EVENT_PLANNING'
				| 'RESUME_WRITING'
				| 'TRANSCRIPTION'
				| 'ONLINE_TUTORING'
				| 'VOICE_ACTING'
				| 'SCRIPT_WRITING'
				| 'BLOG_MANAGEMENT'
				| 'EMAIL_NEWSLETTER_DESIGN'
				| 'MARKET_ANALYSIS'
				| 'USER_TESTING'
				| 'QUALITY_ASSURANCE'
				| 'CHATBOT_DEVELOPMENT'
				| 'API_DEVELOPMENT'
				| 'CLOUD_COMPUTING'
				| 'DEVOPS'
				| 'IT_SUPPORT'
				| 'NETWORK_ADMINISTRATION'
				| 'DATABASE_MANAGEMENT'
				| 'CONTENT_MANAGEMENT'
				| 'WEB_ANALYTICS'
				| 'MOBILE_GAME_DEVELOPMENT'
				| 'AUGMENTED_REALITY_DEVELOPMENT'
				| 'VIRTUAL_REALITY_DEVELOPMENT'
				| 'DIGITAL_ILLUSTRATION'
				| 'CHARACTER_DESIGN'
				| 'SOCIAL_MEDIA_ADVERTISING'
				| 'INFLUENCER_MARKETING'
				| 'SEARCH_ENGINE_MARKETING'
				| 'PAY_PER_CLICK_ADVERTISING'
				| 'GRAPHIC_ANIMATION'
				| 'CORPORATE_IDENTITY'
				| 'PACKAGING_DESIGN'
				| 'PRINT_DESIGN'
				| 'T_SHIRT_DESIGN'
				| 'MERCHANDISE_DESIGN'
				| 'EMAIL_CAMPAIGN_MANAGEMENT'
				| 'ONLINE_COMMUNITY_MANAGEMENT'
				| 'MEMBERSHIP_SITE_DEVELOPMENT'
				| 'ONLINE_COURSE_CREATION'
				| 'E_LEARNING_DEVELOPMENT'
				| 'TECHNICAL_WRITING'
				| 'GRANT_WRITING'
				| 'BUSINESS_PLAN_WRITING'
				| 'PRODUCT_PHOTOGRAPHY'
				| 'REAL_ESTATE_PHOTOGRAPHY'
				| 'FOOD_PHOTOGRAPHY'
				| 'DRONE_PHOTOGRAPHY'
				| 'VIDEO_PRODUCTION'
				| 'LIVE_STREAMING'
				| 'WEBINAR_HOSTING'
				| 'ONLINE_REPUTATION_MANAGEMENT'
				| 'CRISIS_MANAGEMENT'
				| 'CULTURAL_CONSULTING'
				| 'DIVERSITY_CONSULTING'
				| 'SUSTAINABILITY_CONSULTING'
				| 'HEALTH_AND_WELLNESS_COACHING'
				| 'FITNESS_TRAINING'
				| 'NUTRITION_CONSULTING'
				| 'LIFE_COACHING'
				| 'CAREER_COACHING'
				| 'PERSONAL_BRANDING'
				| 'SALES_FUNNEL_DEVELOPMENT'
				| 'CUSTOMER_SERVICE'
				| 'CHAT_SUPPORT'
				| 'TECHNICAL_SUPPORT_DOCUMENTATION'
				| 'USER_EXPERIENCE_RESEARCH'
				| 'MARKET_POSITIONING'
				| 'BRAND_STRATEGY'
				| 'CRISIS_COMMUNICATION'
				| 'EVENT_PROMOTION'
				| 'CROWDFUNDING_CAMPAIGN_MANAGEMENT'
				| 'PRODUCT_LAUNCH_STRATEGY'
				| 'INFLUENCER_OUTREACH'
				| 'SOCIAL_MEDIA_CONTENT_CREATION'
				| 'WEBSITE_MAINTENANCE'
				| 'PERFORMANCE_MARKETING'
				| 'CONVERSION_RATE_OPTIMIZATION';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

// Schema: public
// Enums
export enum Languages {
	EN = 'EN',
	AR = 'AR',
	CKB = 'CKB'
}

export enum Tags {
	WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
	GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
	DIGITAL_MARKETING = 'DIGITAL_MARKETING',
	CONTENT_WRITING = 'CONTENT_WRITING',
	DATA_ENTRY = 'DATA_ENTRY',
	MOBILE_APP_DEVELOPMENT = 'MOBILE_APP_DEVELOPMENT',
	SEO = 'SEO',
	VIDEO_EDITING = 'VIDEO_EDITING',
	TRANSLATION = 'TRANSLATION',
	CONSULTING = 'CONSULTING',
	SOCIAL_MEDIA_MANAGEMENT = 'SOCIAL_MEDIA_MANAGEMENT',
	UI_UX_DESIGN = 'UI_UX_DESIGN',
	E_COMMERCE_DEVELOPMENT = 'E_COMMERCE_DEVELOPMENT',
	SOFTWARE_DEVELOPMENT = 'SOFTWARE_DEVELOPMENT',
	VIRTUAL_ASSISTANT = 'VIRTUAL_ASSISTANT',
	PHOTOGRAPHY = 'PHOTOGRAPHY',
	COPYWRITING = 'COPYWRITING',
	BRANDING = 'BRANDING',
	EMAIL_MARKETING = 'EMAIL_MARKETING',
	MARKET_RESEARCH = 'MARKET_RESEARCH',
	PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT',
	VOICE_OVER = 'VOICE_OVER',
	ANIMATION = 'ANIMATION',
	ILLUSTRATION = 'ILLUSTRATION',
	WEB_HOSTING = 'WEB_HOSTING',
	CYBERSECURITY = 'CYBERSECURITY',
	BLOCKCHAIN_DEVELOPMENT = 'BLOCKCHAIN_DEVELOPMENT',
	GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
	APP_TESTING = 'APP_TESTING',
	TECHNICAL_SUPPORT = 'TECHNICAL_SUPPORT',
	CONTENT_STRATEGY = 'CONTENT_STRATEGY',
	PUBLIC_RELATIONS = 'PUBLIC_RELATIONS',
	PODCAST_EDITING = 'PODCAST_EDITING',
	AFFILIATE_MARKETING = 'AFFILIATE_MARKETING',
	LEAD_GENERATION = 'LEAD_GENERATION',
	DATA_ANALYSIS = 'DATA_ANALYSIS',
	BUSINESS_CONSULTING = 'BUSINESS_CONSULTING',
	FINANCIAL_CONSULTING = 'FINANCIAL_CONSULTING',
	LEGAL_CONSULTING = 'LEGAL_CONSULTING',
	HR_CONSULTING = 'HR_CONSULTING',
	PRODUCT_DESIGN = 'PRODUCT_DESIGN',
	MODELING_3D = 'MODELING_3D',
	INTERIOR_DESIGN = 'INTERIOR_DESIGN',
	FASHION_DESIGN = 'FASHION_DESIGN',
	EVENT_PLANNING = 'EVENT_PLANNING',
	RESUME_WRITING = 'RESUME_WRITING',
	TRANSCRIPTION = 'TRANSCRIPTION',
	ONLINE_TUTORING = 'ONLINE_TUTORING',
	VOICE_ACTING = 'VOICE_ACTING',
	SCRIPT_WRITING = 'SCRIPT_WRITING',
	BLOG_MANAGEMENT = 'BLOG_MANAGEMENT',
	EMAIL_NEWSLETTER_DESIGN = 'EMAIL_NEWSLETTER_DESIGN',
	MARKET_ANALYSIS = 'MARKET_ANALYSIS',
	USER_TESTING = 'USER_TESTING',
	QUALITY_ASSURANCE = 'QUALITY_ASSURANCE',
	CHATBOT_DEVELOPMENT = 'CHATBOT_DEVELOPMENT',
	API_DEVELOPMENT = 'API_DEVELOPMENT',
	CLOUD_COMPUTING = 'CLOUD_COMPUTING',
	DEVOPS = 'DEVOPS',
	IT_SUPPORT = 'IT_SUPPORT',
	NETWORK_ADMINISTRATION = 'NETWORK_ADMINISTRATION',
	DATABASE_MANAGEMENT = 'DATABASE_MANAGEMENT',
	CONTENT_MANAGEMENT = 'CONTENT_MANAGEMENT',
	WEB_ANALYTICS = 'WEB_ANALYTICS',
	MOBILE_GAME_DEVELOPMENT = 'MOBILE_GAME_DEVELOPMENT',
	AUGMENTED_REALITY_DEVELOPMENT = 'AUGMENTED_REALITY_DEVELOPMENT',
	VIRTUAL_REALITY_DEVELOPMENT = 'VIRTUAL_REALITY_DEVELOPMENT',
	DIGITAL_ILLUSTRATION = 'DIGITAL_ILLUSTRATION',
	CHARACTER_DESIGN = 'CHARACTER_DESIGN',
	SOCIAL_MEDIA_ADVERTISING = 'SOCIAL_MEDIA_ADVERTISING',
	INFLUENCER_MARKETING = 'INFLUENCER_MARKETING',
	SEARCH_ENGINE_MARKETING = 'SEARCH_ENGINE_MARKETING',
	PAY_PER_CLICK_ADVERTISING = 'PAY_PER_CLICK_ADVERTISING',
	GRAPHIC_ANIMATION = 'GRAPHIC_ANIMATION',
	CORPORATE_IDENTITY = 'CORPORATE_IDENTITY',
	PACKAGING_DESIGN = 'PACKAGING_DESIGN',
	PRINT_DESIGN = 'PRINT_DESIGN',
	T_SHIRT_DESIGN = 'T_SHIRT_DESIGN',
	MERCHANDISE_DESIGN = 'MERCHANDISE_DESIGN',
	EMAIL_CAMPAIGN_MANAGEMENT = 'EMAIL_CAMPAIGN_MANAGEMENT',
	ONLINE_COMMUNITY_MANAGEMENT = 'ONLINE_COMMUNITY_MANAGEMENT',
	MEMBERSHIP_SITE_DEVELOPMENT = 'MEMBERSHIP_SITE_DEVELOPMENT',
	ONLINE_COURSE_CREATION = 'ONLINE_COURSE_CREATION',
	E_LEARNING_DEVELOPMENT = 'E_LEARNING_DEVELOPMENT',
	TECHNICAL_WRITING = 'TECHNICAL_WRITING',
	GRANT_WRITING = 'GRANT_WRITING',
	BUSINESS_PLAN_WRITING = 'BUSINESS_PLAN_WRITING',
	PRODUCT_PHOTOGRAPHY = 'PRODUCT_PHOTOGRAPHY',
	REAL_ESTATE_PHOTOGRAPHY = 'REAL_ESTATE_PHOTOGRAPHY',
	FOOD_PHOTOGRAPHY = 'FOOD_PHOTOGRAPHY',
	DRONE_PHOTOGRAPHY = 'DRONE_PHOTOGRAPHY',
	VIDEO_PRODUCTION = 'VIDEO_PRODUCTION',
	LIVE_STREAMING = 'LIVE_STREAMING',
	WEBINAR_HOSTING = 'WEBINAR_HOSTING',
	ONLINE_REPUTATION_MANAGEMENT = 'ONLINE_REPUTATION_MANAGEMENT',
	CRISIS_MANAGEMENT = 'CRISIS_MANAGEMENT',
	CULTURAL_CONSULTING = 'CULTURAL_CONSULTING',
	DIVERSITY_CONSULTING = 'DIVERSITY_CONSULTING',
	SUSTAINABILITY_CONSULTING = 'SUSTAINABILITY_CONSULTING',
	HEALTH_AND_WELLNESS_COACHING = 'HEALTH_AND_WELLNESS_COACHING',
	FITNESS_TRAINING = 'FITNESS_TRAINING',
	NUTRITION_CONSULTING = 'NUTRITION_CONSULTING',
	LIFE_COACHING = 'LIFE_COACHING',
	CAREER_COACHING = 'CAREER_COACHING',
	PERSONAL_BRANDING = 'PERSONAL_BRANDING',
	SALES_FUNNEL_DEVELOPMENT = 'SALES_FUNNEL_DEVELOPMENT',
	CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
	CHAT_SUPPORT = 'CHAT_SUPPORT',
	TECHNICAL_SUPPORT_DOCUMENTATION = 'TECHNICAL_SUPPORT_DOCUMENTATION',
	USER_EXPERIENCE_RESEARCH = 'USER_EXPERIENCE_RESEARCH',
	MARKET_POSITIONING = 'MARKET_POSITIONING',
	BRAND_STRATEGY = 'BRAND_STRATEGY',
	CRISIS_COMMUNICATION = 'CRISIS_COMMUNICATION',
	EVENT_PROMOTION = 'EVENT_PROMOTION',
	CROWDFUNDING_CAMPAIGN_MANAGEMENT = 'CROWDFUNDING_CAMPAIGN_MANAGEMENT',
	PRODUCT_LAUNCH_STRATEGY = 'PRODUCT_LAUNCH_STRATEGY',
	INFLUENCER_OUTREACH = 'INFLUENCER_OUTREACH',
	SOCIAL_MEDIA_CONTENT_CREATION = 'SOCIAL_MEDIA_CONTENT_CREATION',
	WEBSITE_MAINTENANCE = 'WEBSITE_MAINTENANCE',
	PERFORMANCE_MARKETING = 'PERFORMANCE_MARKETING',
	CONVERSION_RATE_OPTIMIZATION = 'CONVERSION_RATE_OPTIMIZATION'
}

// Tables
export type Category = Database['public']['Tables']['Category']['Row'];
export type InsertCategory = Database['public']['Tables']['Category']['Insert'];
export type UpdateCategory = Database['public']['Tables']['Category']['Update'];

export type Conversation = Database['public']['Tables']['Conversation']['Row'];
export type InsertConversation = Database['public']['Tables']['Conversation']['Insert'];
export type UpdateConversation = Database['public']['Tables']['Conversation']['Update'];

export type ConversationParticipant =
	Database['public']['Tables']['ConversationParticipant']['Row'];
export type InsertConversationParticipant =
	Database['public']['Tables']['ConversationParticipant']['Insert'];
export type UpdateConversationParticipant =
	Database['public']['Tables']['ConversationParticipant']['Update'];

export type Language = Database['public']['Tables']['Language']['Row'];
export type InsertLanguage = Database['public']['Tables']['Language']['Insert'];
export type UpdateLanguage = Database['public']['Tables']['Language']['Update'];

export type Message = Database['public']['Tables']['Message']['Row'];
export type InsertMessage = Database['public']['Tables']['Message']['Insert'];
export type UpdateMessage = Database['public']['Tables']['Message']['Update'];

export type Notification = Database['public']['Tables']['Notification']['Row'];
export type InsertNotification = Database['public']['Tables']['Notification']['Insert'];
export type UpdateNotification = Database['public']['Tables']['Notification']['Update'];

export type NotificationUser = Database['public']['Tables']['NotificationUser']['Row'];
export type InsertNotificationUser = Database['public']['Tables']['NotificationUser']['Insert'];
export type UpdateNotificationUser = Database['public']['Tables']['NotificationUser']['Update'];

export type Policy = Database['public']['Tables']['Policy']['Row'];
export type InsertPolicy = Database['public']['Tables']['Policy']['Insert'];
export type UpdatePolicy = Database['public']['Tables']['Policy']['Update'];

export type Rating = Database['public']['Tables']['Rating']['Row'];
export type InsertRating = Database['public']['Tables']['Rating']['Insert'];
export type UpdateRating = Database['public']['Tables']['Rating']['Update'];

export type Role = Database['public']['Tables']['Role']['Row'];
export type InsertRole = Database['public']['Tables']['Role']['Insert'];
export type UpdateRole = Database['public']['Tables']['Role']['Update'];

export type RolePolicy = Database['public']['Tables']['RolePolicy']['Row'];
export type InsertRolePolicy = Database['public']['Tables']['RolePolicy']['Insert'];
export type UpdateRolePolicy = Database['public']['Tables']['RolePolicy']['Update'];

export type Service = Database['public']['Tables']['Service']['Row'];
export type InsertService = Database['public']['Tables']['Service']['Insert'];
export type UpdateService = Database['public']['Tables']['Service']['Update'];

export type Subcategory = Database['public']['Tables']['Subcategory']['Row'];
export type InsertSubcategory = Database['public']['Tables']['Subcategory']['Insert'];
export type UpdateSubcategory = Database['public']['Tables']['Subcategory']['Update'];

export type TypingStatus = Database['public']['Tables']['TypingStatus']['Row'];
export type InsertTypingStatus = Database['public']['Tables']['TypingStatus']['Insert'];
export type UpdateTypingStatus = Database['public']['Tables']['TypingStatus']['Update'];

export type User = Database['public']['Tables']['User']['Row'];
export type InsertUser = Database['public']['Tables']['User']['Insert'];
export type UpdateUser = Database['public']['Tables']['User']['Update'];

export type UserService = Database['public']['Tables']['UserService']['Row'];
export type InsertUserService = Database['public']['Tables']['UserService']['Insert'];
export type UpdateUserService = Database['public']['Tables']['UserService']['Update'];

// Functions
export type ArgsCompareUserPassword =
	Database['public']['Functions']['compare_user_password']['Args'];
export type ReturnTypeCompareUserPassword =
	Database['public']['Functions']['compare_user_password']['Returns'];

export type ArgsVerifyUserPassword =
	Database['public']['Functions']['verify_user_password']['Args'];
export type ReturnTypeVerifyUserPassword =
	Database['public']['Functions']['verify_user_password']['Returns'];
